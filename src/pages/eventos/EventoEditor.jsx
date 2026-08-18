import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '@/quill-custom.css';
import DOMPurify from 'dompurify';
import { Loader2, Upload, Save, ArrowLeft, Calendar, MapPin, Globe, Map } from 'lucide-react';

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
    ['link', 'image'],
    ['clean']
  ],
};

const quillFormats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image'
];

const copaInput = 'rounded-none border-copa-gold bg-copa-cream text-copa-ink placeholder:text-copa-ink/40 focus-visible:ring-1 focus-visible:ring-copa-burgundy';
const copaLabel = 'font-jost text-[11px] tracking-[0.14em] uppercase text-copa-ink/70 flex items-center';

const EventoEditor = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentEvent, setCurrentEvent] = useState(null);

  const isEditing = !!slug;

  const formatForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - timezoneOffset);
    return localDate.toISOString().slice(0, 16);
  };

  const fetchEvent = useCallback(async () => {
    if (!isEditing) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      toast({ variant: "destructive", title: "Error", description: "No se pudo cargar el evento para editar." });
      navigate('/eventos');
    } else {
      setCurrentEvent(data);
      const defaultValues = {
        title: data.title,
        // Strips legacy inline color spans so editing/re-saving permanently cleans up events
        // that still carry them (the toolbar has no color picker, so no inline color here is
        // ever intentional admin formatting).
        description: DOMPurify.sanitize(data.description, { FORBID_ATTR: ['style'] }),
        event_date: formatForInput(data.event_date),
        location: data.location,
        country: data.country,
        city: data.city,
      };
      reset(defaultValues);
      setImagePreview(data.image_url);
    }
    setIsLoading(false);
  }, [slug, isEditing, navigate, toast, reset]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async (currentImageUrl) => {
    if (!imageFile) {
      return currentImageUrl || null;
    }

    const fileExt = imageFile.name.split('.').pop();
    const fileName = `events/${user.id}_${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('article-images')
      .upload(fileName, imageFile);

    if (uploadError) {
      throw new Error(`Error al subir imagen: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabase.storage.from('article-images').getPublicUrl(fileName);
    const newImageUrl = publicUrlData.publicUrl;

    if (isEditing && currentImageUrl) {
      const oldImageParts = currentImageUrl.split('/');
      const oldImageNameWithFolder = oldImageParts.slice(-2).join('/');
      if (oldImageNameWithFolder && oldImageNameWithFolder.startsWith('events/')) {
        await supabase.storage.from('article-images').remove([oldImageNameWithFolder]);
      }
    }

    return newImageUrl;
  };

  const onSubmit = async (formData) => {
    if (!user) {
      toast({ variant: "destructive", title: "No autenticado" });
      return;
    }
    setIsSubmitting(true);

    try {
      const imageUrl = await handleImageUpload(currentEvent?.image_url);

      const eventData = {
        title: formData.title,
        description: formData.description,
        event_date: new Date(formData.event_date).toISOString(),
        location: formData.location,
        country: formData.country,
        city: formData.city,
        image_url: imageUrl,
      };

      let result;
      if (isEditing) {
        const { data, error } = await supabase.from('events').update(eventData).eq('id', currentEvent.id).select().single();
        if (error) throw error;
        result = data;
        toast({ title: "Evento actualizado", description: "El evento ha sido modificado con éxito." });
      } else {
        const { data, error } = await supabase.from('events').insert([eventData]).select().single();
        if (error) throw error;
        result = data;
        toast({ title: "Evento creado", description: "El nuevo evento ha sido publicado." });
      }
      navigate(`/eventos/${result.slug}`);
    } catch (error) {
      toast({ variant: "destructive", title: "Error al guardar", description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] bg-copa-cream">
        <Loader2 className="h-14 w-14 text-copa-burgundy animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-copa-cream text-copa-ink min-h-screen" style={{ fontFamily: "'EB Garamond', serif" }}>
      <Helmet>
        <title>{isEditing ? 'Editando Evento' : 'Crear Nuevo Evento'} - Vako Club</title>
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-20">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <button type="button" onClick={() => navigate('/eventos')} className="copa-link-nav font-jost text-[11px] tracking-[0.14em] uppercase inline-flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Eventos
            </button>
            <h1 className="font-cormorant font-light text-center" style={{ fontSize: 'clamp(26px,3.6vw,36px)' }}>
              {isEditing ? 'Editar Evento' : 'Crear Nuevo Evento'}
            </h1>
            <button type="submit" disabled={isSubmitting} className="copa-btn-nav inline-flex items-center">
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {isEditing ? 'Guardar Cambios' : 'Publicar Evento'}
            </button>
          </div>

          <div className="border border-copa-gold p-8 space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className={copaLabel}>Título del Evento</label>
              <Input
                id="title"
                {...register('title', { required: 'El título es obligatorio' })}
                className={`${copaInput} text-xl`}
                placeholder="Ej: Cata de Vinos de Rioja"
              />
              {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <label className={copaLabel}>Descripción</label>
              <div className="copa-quill">
                <Controller
                  name="description"
                  control={control}
                  rules={{ required: 'La descripción es obligatoria.' }}
                  render={({ field }) => (
                    <ReactQuill
                      theme="snow"
                      value={field.value}
                      onChange={field.onChange}
                      modules={quillModules}
                      formats={quillFormats}
                      placeholder="Describe los detalles del evento, el programa, los vinos a catar, etc."
                    />
                  )}
                />
              </div>
              {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="event_date" className={copaLabel}><Calendar className="mr-2 h-4 w-4" />Fecha y Hora</label>
                <Input id="event_date" type="datetime-local" {...register('event_date', { required: 'La fecha es obligatoria' })} className={copaInput} />
                {errors.event_date && <p className="text-red-600 text-sm mt-1">{errors.event_date.message}</p>}
              </div>
              <div className="space-y-2">
                <label htmlFor="location" className={copaLabel}><MapPin className="mr-2 h-4 w-4" />Lugar (Nombre del sitio)</label>
                <Input id="location" {...register('location', { required: 'El lugar es obligatorio' })} className={copaInput} placeholder="Ej: Bodega Marqués de Riscal" />
                {errors.location && <p className="text-red-600 text-sm mt-1">{errors.location.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="country" className={copaLabel}><Globe className="mr-2 h-4 w-4" />País</label>
                <Input id="country" {...register('country', { required: 'El país es obligatorio' })} className={copaInput} placeholder="Ej: España" />
                {errors.country && <p className="text-red-600 text-sm mt-1">{errors.country.message}</p>}
              </div>
              <div className="space-y-2">
                <label htmlFor="city" className={copaLabel}><Map className="mr-2 h-4 w-4" />Ciudad</label>
                <Input id="city" {...register('city', { required: 'La ciudad es obligatoria' })} className={copaInput} placeholder="Ej: Logroño" />
                {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="image" className={copaLabel}>Imagen del Evento</label>
              <div className="flex items-center gap-4">
                {imagePreview && <img src={imagePreview} alt="Vista previa" className="h-24 w-36 object-cover" />}
                <label className="copa-btn-secondary cursor-pointer inline-flex items-center">
                  <Upload className="mr-2 h-4 w-4" />
                  {imageFile ? 'Cambiar imagen' : 'Seleccionar imagen'}
                  <input id="image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventoEditor;
