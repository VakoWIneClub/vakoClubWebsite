
import React, { useState, useEffect } from 'react';
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
import { Loader2, Save, ArrowLeft, Trash2, ImagePlus, MapPin, Globe, Link as LinkIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GrapeRating from '@/components/guia/GrapeRating';

const WineryEditor = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { register, handleSubmit, setValue, control, watch, formState: { errors } } = useForm({
    defaultValues: { score: 0 }
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [winery, setWinery] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  
  const watchedScore = watch('score');
  const isEditing = !!slug;

  useEffect(() => {
    const fetchWinery = async () => {
      if (!isEditing) {
        setIsLoading(false);
        return;
      }
      
      const { data, error } = await supabase.from('wineries').select('*').eq('slug', slug).single();

      if (error || !data) {
        toast({ variant: "destructive", title: "Error", description: "No se pudo cargar la bodega para editar." });
        navigate('/guia');
      } else {
        setWinery(data);
        setValue('title', data.title);
        setValue('description', data.description);
        setValue('score', data.score);
        setValue('address', data.address);
        setValue('country', data.country);
        setValue('city', data.city);
        setValue('website_url', data.website_url);
        setImagePreviews(data.image_urls || []);
      }
      setIsLoading(false);
    };

    fetchWinery();
  }, [slug, isEditing, navigate, setValue, toast]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImageFiles(prev => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index) => {
    const newPreviews = [...imagePreviews];
    const newFiles = [...imageFiles];
    
    const removedPreview = newPreviews.splice(index, 1)[0];
    setImagePreviews(newPreviews);

    if (removedPreview.startsWith('blob:')) {
      const fileIndex = imageFiles.findIndex(file => URL.createObjectURL(file) === removedPreview);
      if (fileIndex > -1) newFiles.splice(fileIndex, 1);
      setImageFiles(newFiles);
    }
  };

  const handleImageUploads = async () => {
    const uploadedUrls = [];
    const existingUrls = imagePreviews.filter(p => !p.startsWith('blob:'));

    for (const file of imageFiles) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}_${Date.now()}_${Math.random()}.${fileExt}`;
      const filePath = `public/${fileName}`;

      const { error } = await supabase.storage.from('winery-images').upload(filePath, file);
      if (error) throw new Error(`Error al subir imagen: ${error.message}`);
      
      const { data } = supabase.storage.from('winery-images').getPublicUrl(filePath);
      uploadedUrls.push(data.publicUrl);
    }
    
    return [...existingUrls, ...uploadedUrls];
  };

  // === Quill: handler para subir e insertar imágenes ===
  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file || !user) return;

      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}_${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;
        const filePath = `public/${fileName}`;

        const { error } = await supabase.storage.from('winery-images').upload(filePath, file);
        if (error) throw error;

        const { data } = supabase.storage.from('winery-images').getPublicUrl(filePath);
        const url = data.publicUrl;

        const quill = reactQuillRef.current?.getEditor?.();
        const range = quill?.getSelection(true);
        quill?.insertEmbed(range?.index ?? 0, 'image', url, 'user');
        quill?.setSelection((range?.index ?? 0) + 1);

      } catch (e) {
        toast({ variant: 'destructive', title: 'Error al subir imagen', description: e.message || 'Inténtalo de nuevo' });
      }
    };
    input.click();
  }, [user, toast]);

  // === Quill: módulos y formatos ===
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: imageHandler,
      },
    },
  }), [imageHandler]);

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
  ];

  const getCoordinatesForAddress = async (address) => {
    if (!address || address.trim() === '') {
      return { latitude: null, longitude: null };
    }
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data && data.length > 0) {
        return { latitude: parseFloat(data[0].lat), longitude: parseFloat(data[0].lon) };
      }
      toast({ variant: 'destructive', title: 'Dirección no encontrada', description: 'No se pudieron obtener las coordenadas para la dirección proporcionada. El mapa no se mostrará.' });
      return { latitude: null, longitude: null };
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      toast({ variant: 'destructive', title: 'Error de geocodificación', description: 'No se pudo contactar con el servicio de mapas.' });
      return { latitude: null, longitude: null };
    }
  };

  const onSubmit = async (formData) => {
    if (!user) {
      toast({ variant: "destructive", title: "No autenticado" });
      return;
    }
    setIsSubmitting(true);

    try {
      const imageUrls = await handleImageUploads();
      const { latitude, longitude } = await getCoordinatesForAddress(formData.address);

      const wineryData = {
        title: formData.title,
        description: formData.description,
        score: formData.score ? parseFloat(formData.score) : null,
        country: formData.country,
        city: formData.city,
        address: formData.address,
        website_url: formData.website_url,
        latitude,
        longitude,
        image_urls: imageUrls,
        author_id: user.id,
        updated_at: new Date().toISOString(),
      };

      let result;
      if (isEditing) {
        const { data, error } = await supabase.from('wineries').update(wineryData).eq('id', winery.id).select().single();
        if (error) throw error;
        result = data;
        toast({ title: "Bodega actualizada", description: "La bodega ha sido modificada con éxito." });
      } else {
        const { data, error } = await supabase.from('wineries').insert(wineryData).select().single();
        if (error) throw error;
        result = data;
        toast({ title: "Bodega creada", description: "La nueva bodega ha sido añadida a la guía." });
      }
      navigate(`/guia/${result.slug}`);
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
      <Helmet><title>{isEditing ? 'Editar Bodega' : 'Crear Bodega'} - Vako Club</title></Helmet>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex justify-between items-center">
            <Button type="button" variant="ghost" onClick={() => navigate('/guia')} className="text-amber-200">
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver
            </Button>
            <h1 className="font-playfair text-3xl md:text-4xl font-bold wine-text-gradient text-center">
              {isEditing ? 'Editar Bodega' : 'Nueva Bodega'}
            </h1>
            <Button type="submit" disabled={isSubmitting} size="lg">
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {isEditing ? 'Guardar' : 'Publicar'}
            </Button>
          </div>

          <div className="wine-card p-8 rounded-2xl space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-amber-200 text-lg">Nombre de la Bodega</Label>
              <Input id="title" {...register('title', { required: 'El nombre es obligatorio' })} className="wine-input text-xl" placeholder="Ej: Bodega Catena Zapata" />
              {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                <Label htmlFor="country" className="text-amber-200 text-lg"><Globe className="inline-block mr-2 h-5 w-5"/>País</Label>
                <Input id="country" {...register('country', { required: 'El país es obligatorio' })} className="wine-input" placeholder="Ej: Argentina"/>
                {errors.country && <p className="text-red-400 text-sm mt-1">{errors.country.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="city" className="text-amber-200 text-lg"><MapPin className="inline-block mr-2 h-5 w-5"/>Ciudad</Label>
                <Input id="city" {...register('city', { required: 'La ciudad es obligatoria' })} className="wine-input" placeholder="Ej: Mendoza"/>
                {errors.city && <p className="text-red-400 text-sm mt-1">{errors.city.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-amber-200 text-lg">Dirección Completa</Label>
              <Input id="address" {...register('address')} className="wine-input" placeholder="Para mostrar en el mapa (Ej: Cobos s/n, Luján de Cuyo, Mendoza, Argentina)"/>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website_url" className="text-amber-200 text-lg"><LinkIcon className="inline-block mr-2 h-5 w-5"/>Sitio Web</Label>
              <Input id="website_url" {...register('website_url')} className="wine-input" placeholder="https://www.bodega.com"/>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-amber-200 text-lg">Descripción</Label>
              <Controller
                name="description"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <ReactQuill
                    ref={reactQuillRef}
                    theme="snow"
                    value={field.value || ''}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    modules={modules}
                    formats={formats}
                    placeholder="Describe la bodega, su historia, sus vinos destacados, etc."
                  />
                )}
              />
            </div>

            <div className="space-y-3">
              <Label className="text-amber-200 text-lg">Puntuación</Label>
              <div className="flex items-center gap-4 bg-white/5 p-3 rounded-lg">
                <Controller
                  name="score"
                  control={control}
                  render={({ field }) => (
                    <GrapeRating
                      rating={field.value}
                      onRatingChange={field.onChange}
                      interactive
                      size={28}
                    />
                  )}
                />
                <span className="font-bold text-amber-200 text-xl w-24 text-center">{Number(watchedScore).toFixed(1)} / 5.0</span>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={watchedScore}
                  onChange={(e) => setValue('score', Math.max(0, Math.min(5, parseFloat(e.target.value) || 0)))}
                  className="wine-input w-28"
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-amber-200 text-lg">Imágenes</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <AnimatePresence>
                  {imagePreviews.map((src, index) => (
                    <motion.div key={src} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="relative group aspect-square">
                      <img src={src} alt={`Vista previa ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                      <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeImage(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <Button asChild variant="outline" className="aspect-square flex-col h-full">
                  <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                    <ImagePlus className="h-8 w-8 text-amber-300/70 mb-2" />
                    <span className="text-center text-sm">Añadir</span>
                    <input id="images" type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
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

export default WineryEditor;
