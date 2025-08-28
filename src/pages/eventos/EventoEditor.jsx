
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Upload, Save, ArrowLeft, Calendar, MapPin, Globe, Map } from 'lucide-react';

const EventoEditor = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { register, handleSubmit, setValue, control, reset, formState: { errors } } = useForm();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentEvent, setCurrentEvent] = useState(null);

  const isEditing = !!slug;

  const formatForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    // Adjust for timezone offset before slicing
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
          description: data.description,
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
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-16 w-16 text-amber-300 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{isEditing ? 'Editando Evento' : 'Crear Nuevo Evento'} - Vako Club</title>
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex justify-between items-center">
            <Button type="button" variant="ghost" onClick={() => navigate('/eventos')} className="text-amber-200">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Eventos
            </Button>
            <h1 className="font-playfair text-3xl md:text-4xl font-bold wine-text-gradient text-center">
              {isEditing ? 'Editar Evento' : 'Crear Nuevo Evento'}
            </h1>
            <Button type="submit" disabled={isSubmitting} size="lg">
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {isEditing ? 'Guardar Cambios' : 'Publicar Evento'}
            </Button>
          </div>

          <div className="wine-card p-8 rounded-2xl space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-amber-200 text-lg">Título del Evento</Label>
              <Input id="title" {...register('title', { required: 'El título es obligatorio' })} className="wine-input text-xl" placeholder="Ej: Cata de Vinos de Rioja"/>
              {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="description" className="text-amber-200 text-lg">Descripción</Label>
                <Controller
                    name="description"
                    control={control}
                    rules={{ required: 'La descripción es obligatoria' }}
                    render={({ field }) => (
                        <Textarea id="description" {...field} className="wine-input" placeholder="Describe los detalles del evento..." rows={5} />
                    )}
                />
                {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="event_date" className="text-amber-200 text-lg flex items-center"><Calendar className="mr-2 h-4 w-4"/>Fecha y Hora</Label>
                    <Input id="event_date" type="datetime-local" {...register('event_date', { required: 'La fecha es obligatoria' })} className="wine-input" />
                    {errors.event_date && <p className="text-red-400 text-sm mt-1">{errors.event_date.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="location" className="text-amber-200 text-lg flex items-center"><MapPin className="mr-2 h-4 w-4"/>Lugar (Nombre del sitio)</Label>
                    <Input id="location" {...register('location', { required: 'El lugar es obligatorio' })} className="wine-input" placeholder="Ej: Bodega Marqués de Riscal" />
                    {errors.location && <p className="text-red-400 text-sm mt-1">{errors.location.message}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="country" className="text-amber-200 text-lg flex items-center"><Globe className="mr-2 h-4 w-4"/>País</Label>
                    <Input id="country" {...register('country', { required: 'El país es obligatorio' })} className="wine-input" placeholder="Ej: España" />
                    {errors.country && <p className="text-red-400 text-sm mt-1">{errors.country.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="city" className="text-amber-200 text-lg flex items-center"><Map className="mr-2 h-4 w-4"/>Ciudad</Label>
                    <Input id="city" {...register('city', { required: 'La ciudad es obligatoria' })} className="wine-input" placeholder="Ej: Logroño" />
                    {errors.city && <p className="text-red-400 text-sm mt-1">{errors.city.message}</p>}
                </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image" className="text-amber-200 text-lg">Imagen del Evento</Label>
              <div className="flex items-center gap-4">
                {imagePreview && <img src={imagePreview} alt="Vista previa" className="h-24 w-36 rounded-lg object-cover" />}
                <Button asChild variant="outline" className="flex-1">
                  <label className="cursor-pointer">
                    <Upload className="mr-2 h-4 w-4" />
                    {imageFile ? 'Cambiar imagen' : 'Seleccionar imagen'}
                    <input id="image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </Button>
              </div>
            </div>

          </div>
        </form>
      </div>
    </>
  );
};

export default EventoEditor;