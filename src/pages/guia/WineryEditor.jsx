
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Loader2, Save, ArrowLeft, Trash2, ImagePlus, MapPin, Globe, Link as LinkIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactQuill from 'react-quill';

const copaInput = 'rounded-none border-copa-gold bg-copa-cream text-copa-ink placeholder:text-copa-ink/40 focus-visible:ring-1 focus-visible:ring-copa-burgundy';
const copaLabel = 'font-jost text-[11px] tracking-[0.14em] uppercase text-copa-ink/70 flex items-center';

const WineryEditor = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { register, handleSubmit, setValue, control, formState: { errors } } = useForm({
    defaultValues: { description: '' }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [winery, setWinery] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [removedExistingUrls, setRemovedExistingUrls] = useState([]);

  const isEditing = !!slug;

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link'],
      ['clean']
    ],
  };

  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'blockquote',
    'list', 'bullet',
    'link'
  ];

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
      // Pairing each file with the exact object URL created for it (instead of comparing
      // against a freshly regenerated URL.createObjectURL(file) later) — createObjectURL
      // returns a new, unique URL on every call even for the same File, so re-deriving it in
      // removeImage below could never match and "removed" images kept getting uploaded anyway.
      const newEntries = files.map(file => ({ file, previewUrl: URL.createObjectURL(file) }));
      setImageFiles(prev => [...prev, ...newEntries]);
      setImagePreviews(prev => [...prev, ...newEntries.map(entry => entry.previewUrl)]);
    }
  };

  const removeImage = (index) => {
    const removedPreview = imagePreviews[index];
    setImagePreviews(prev => prev.filter((_, i) => i !== index));

    if (removedPreview.startsWith('blob:')) {
      setImageFiles(prev => prev.filter(entry => entry.previewUrl !== removedPreview));
      URL.revokeObjectURL(removedPreview);
    } else {
      // Track already-uploaded images removed during this edit so their storage objects can be
      // deleted once the save actually succeeds — removing them immediately would lose the
      // file if the admin then navigates away without saving.
      setRemovedExistingUrls(prev => [...prev, removedPreview]);
    }
  };

  const storagePathFromUrl = (url) => {
    const marker = '/winery-images/';
    const idx = url.indexOf(marker);
    return idx === -1 ? null : url.slice(idx + marker.length);
  };

  const handleImageUploads = async () => {
    const uploadedUrls = [];
    const existingUrls = imagePreviews.filter(p => !p.startsWith('blob:'));

    for (const { file } of imageFiles) {
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

      // Re-geocoding on every save — even ones that never touch the address — meant any
      // transient failure or Nominatim rate-limit silently wiped a winery's existing map pin
      // (getCoordinatesForAddress returns null,null on failure, which used to be saved as-is).
      // Only re-geocode when the address actually changed, and fall back to the winery's
      // current coordinates instead of nulling them out if the new lookup fails.
      let latitude = winery?.latitude ?? null;
      let longitude = winery?.longitude ?? null;
      const addressChanged = !isEditing || formData.address !== winery?.address;
      if (addressChanged) {
        const coords = await getCoordinatesForAddress(formData.address);
        if (coords.latitude !== null && coords.longitude !== null) {
          ({ latitude, longitude } = coords);
        } else if (!formData.address || formData.address.trim() === '') {
          // Address was intentionally cleared — no location is the correct outcome.
          latitude = null;
          longitude = null;
        }
        // Otherwise geocoding failed/found nothing: keep the winery's existing coordinates
        // (already toasted inside getCoordinatesForAddress).
      }

      const wineryData = {
        title: formData.title,
        description: formData.description,
        country: formData.country.trim(),
        city: formData.city.trim(),
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

      if (removedExistingUrls.length > 0) {
        const paths = removedExistingUrls.map(storagePathFromUrl).filter(Boolean);
        if (paths.length > 0) {
          const { error: removeError } = await supabase.storage.from('winery-images').remove(paths);
          if (removeError) console.error('Error removing orphaned winery images:', removeError.message);
        }
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
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] bg-copa-cream">
        <Loader2 className="h-14 w-14 text-copa-burgundy animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-copa-cream text-copa-ink min-h-screen" style={{ fontFamily: "'EB Garamond', serif" }}>
      <Helmet><title>{isEditing ? 'Editar Bodega' : 'Crear Bodega'} - Vako Club</title></Helmet>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-20">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <button type="button" onClick={() => navigate('/guia')} className="copa-link-nav font-jost text-[11px] tracking-[0.14em] uppercase inline-flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver
            </button>
            <h1 className="font-cormorant font-light text-center" style={{ fontSize: 'clamp(26px,3.6vw,36px)' }}>
              {isEditing ? 'Editar Bodega' : 'Nueva Bodega'}
            </h1>
            <button type="submit" disabled={isSubmitting} className="copa-btn-nav inline-flex items-center">
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {isEditing ? 'Guardar' : 'Publicar'}
            </button>
          </div>

          <div className="border border-copa-gold p-8 space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className={copaLabel}>Nombre de la Bodega</label>
              <Input id="title" {...register('title', { required: 'El nombre es obligatorio' })} className={`${copaInput} text-xl`} placeholder="Ej: Bodega Catena Zapata" />
              {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                <label htmlFor="country" className={copaLabel}><Globe className="mr-2 h-4 w-4"/>País</label>
                <Input id="country" {...register('country', { required: 'El país es obligatorio' })} className={copaInput} placeholder="Ej: Argentina"/>
                {errors.country && <p className="text-red-600 text-sm mt-1">{errors.country.message}</p>}
              </div>
              <div className="space-y-2">
                <label htmlFor="city" className={copaLabel}><MapPin className="mr-2 h-4 w-4"/>Ciudad</label>
                <Input id="city" {...register('city', { required: 'La ciudad es obligatoria' })} className={copaInput} placeholder="Ej: Mendoza"/>
                {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="address" className={copaLabel}>Dirección Completa</label>
              <Input id="address" {...register('address')} className={copaInput} placeholder="Para mostrar en el mapa (Ej: Cobos s/n, Luján de Cuyo, Mendoza, Argentina)"/>
            </div>

            <div className="space-y-2">
              <label htmlFor="website_url" className={copaLabel}><LinkIcon className="mr-2 h-4 w-4"/>Sitio Web</label>
              <Input id="website_url" {...register('website_url')} className={copaInput} placeholder="https://www.bodega.com"/>
            </div>

            <div className="space-y-2">
              <label className={copaLabel}>Descripción</label>
              <div className="copa-quill">
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <ReactQuill
                      theme="snow"
                      value={field.value}
                      onChange={field.onChange}
                      modules={quillModules}
                      formats={quillFormats}
                      placeholder="Describe la bodega, su historia, sus vinos destacados, etc."
                    />
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className={copaLabel}>Imágenes</label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <AnimatePresence>
                  {imagePreviews.map((src, index) => (
                    <motion.div key={src} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="relative group aspect-square">
                      <img src={src} alt={`Vista previa ${index + 1}`} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeImage(index)} aria-label="Quitar imagen" className="absolute top-1 right-1 h-7 w-7 flex items-center justify-center bg-copa-burgundy text-copa-cream opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <label className="aspect-square border border-copa-gold flex flex-col items-center justify-center cursor-pointer hover:border-copa-burgundy transition-colors">
                  <ImagePlus className="h-7 w-7 text-copa-gold mb-2" />
                  <span className="text-center text-sm text-copa-ink/70">Añadir</span>
                  <input id="images" type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                </label>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WineryEditor;
