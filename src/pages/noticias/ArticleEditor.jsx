import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Upload, Save, ArrowLeft, Tag } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '@/quill-custom.css';
import DOMPurify from 'dompurify';
import { isAdminUser } from '@/lib/utils';

const TAGS = ["Bodegas", "Vinos", "Maridajes", "Regiones", "Experiencias", "Noticias"];

const copaInput = 'rounded-none border-copa-gold bg-copa-cream text-copa-ink placeholder:text-copa-ink/40 focus-visible:ring-1 focus-visible:ring-copa-burgundy';
const copaLabel = 'font-jost text-[11px] tracking-[0.14em] uppercase text-copa-ink/70 flex items-center';

const ArticleEditor = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { register, handleSubmit, setValue, control, watch, formState: { errors } } = useForm();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [article, setArticle] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const quillRef = useRef(null);
  // Guards against React StrictMode's dev-mode double-invoke of the load effect below: without
  // this, a second (stale) fetch resolving after the admin has already started editing the form
  // calls setValue() again with the ORIGINAL data, silently discarding their in-progress edit
  // right before submit — same class of bug fixed in Perfil.jsx's hydratedUserIdRef.
  const hydratedSlugRef = useRef(null);

  const isEditing = !!slug;
  const isAdmin = isAdminUser(user);

  const tag1Value = watch('tag1');
  const tag2Value = watch('tag2');

  // Etiqueta 2's own dropdown already filters out whatever tag1 currently is, but that never
  // touched an *already-selected* tag2 value — changing tag1 to match a tag2 picked earlier let
  // a submit save tag1 === tag2 despite the UI's own intent to prevent picking the same tag
  // twice.
  useEffect(() => {
    if (tag1Value && tag2Value && tag1Value === tag2Value) {
      setValue('tag2', null);
    }
  }, [tag1Value, tag2Value, setValue]);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!isEditing) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .single();

      if (hydratedSlugRef.current === slug) {
        // Already hydrated the form for this slug — this is a stale duplicate resolution, and
        // applying it now would stomp on whatever the admin has already typed.
        setIsLoading(false);
        return;
      }

      if (error || !data) {
        toast({ variant: "destructive", title: "Error", description: "No se pudo cargar el artículo para editar." });
        navigate('/noticias');
      } else {
        hydratedSlugRef.current = slug;
        setArticle(data);
        setValue('title', data.title);
        // Strips legacy inline color spans from the old dark theme so editing/re-saving
        // permanently cleans up articles that still carry them (the toolbar has no color
        // picker, so no inline color here is ever intentional admin formatting).
        setValue('content', DOMPurify.sanitize(data.content, { FORBID_ATTR: ['style'] }));
        setValue('tag1', data.tag1);
        setValue('tag2', data.tag2);
        setImagePreview(data.image_url);
      }
      setIsLoading(false);
    };

    fetchArticle();
  }, [slug, isEditing, navigate, setValue, toast]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return article?.image_url || null;

    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${user.id}_${Date.now()}.${fileExt}`;
    const filePath = `public/${fileName}`;

    const { error } = await supabase.storage.from('article-images').upload(filePath, imageFile);
    if (error) throw new Error(`Error al subir imagen principal: ${error.message}`);

    const { data } = supabase.storage.from('article-images').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        setIsSubmitting(true);
        try {
          const fileExt = file.name.split('.').pop();
          const fileName = `${user.id}_content_${Date.now()}.${fileExt}`;
          const filePath = `public/${fileName}`;

          const { error: uploadError } = await supabase.storage.from('article-images').upload(filePath, file);
          if (uploadError) throw uploadError;

          const { data } = supabase.storage.from('article-images').getPublicUrl(filePath);
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, 'image', data.publicUrl);
          quill.setSelection(range.index + 1);
        } catch (error) {
          toast({ variant: "destructive", title: "Error al subir imagen", description: error.message });
        } finally {
          setIsSubmitting(false);
        }
      }
    };
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: imageHandler,
      },
    },
  }), []);

  const onSubmit = async (formData) => {
    if (!user) {
      toast({ variant: "destructive", title: "No autenticado" });
      return;
    }
    setIsSubmitting(true);

    try {
      const imageUrl = await handleImageUpload();
      const articleData = {
        title: formData.title,
        content: formData.content,
        image_url: imageUrl,
        author_id: user.id,
        updated_at: new Date().toISOString(),
        tag1: formData.tag1 || null,
        tag2: formData.tag2 || null,
      };

      let result;
      if (isEditing) {
        const { data, error } = await supabase.from('articles').update(articleData).eq('id', article.id).select().single();
        if (error) throw error;
        result = data;
        toast({ title: "Artículo actualizado", description: "El artículo ha sido modificado con éxito." });
      } else {
        const { data, error } = await supabase.from('articles').insert(articleData).select().single();
        if (error) throw error;
        result = data;
        toast({ title: "Artículo creado", description: "El nuevo artículo ha sido publicado." });
      }
      navigate(`/noticias/${result.slug}`);
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
        <title>{isEditing ? 'Editando Artículo' : 'Crear Nuevo Artículo'} - Vako Club</title>
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-20">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <button type="button" onClick={() => navigate('/noticias')} className="copa-link-nav font-jost text-[11px] tracking-[0.14em] uppercase inline-flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Noticias
            </button>
            <h1 className="font-cormorant font-light text-center" style={{ fontSize: 'clamp(26px,3.6vw,36px)' }}>
              {isEditing ? 'Editar Artículo' : 'Crear Nuevo Artículo'}
            </h1>
            <button type="submit" disabled={isSubmitting} className="copa-btn-nav inline-flex items-center">
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {isEditing ? 'Guardar Cambios' : 'Publicar'}
            </button>
          </div>

          <div className="border border-copa-gold p-8 space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className={copaLabel}>Título del Artículo</label>
              <Input
                id="title"
                {...register('title', { required: 'El título es obligatorio.' })}
                className={`${copaInput} text-xl`}
                placeholder="Un titular atractivo y conciso"
              />
              {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>}
            </div>

            {isAdmin && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="tag1" className={copaLabel}><Tag className="mr-2 h-4 w-4" />Etiqueta 1</label>
                  <Controller
                    name="tag1"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger id="tag1" className={copaInput}>
                          <SelectValue placeholder="Selecciona una etiqueta" />
                        </SelectTrigger>
                        <SelectContent className="border-copa-gold bg-copa-cream text-copa-ink rounded-none">
                          <SelectItem value={null} className="focus:bg-copa-gold/20 focus:text-copa-ink">Sin etiqueta</SelectItem>
                          {TAGS.map(tag => <SelectItem key={tag} value={tag} className="focus:bg-copa-gold/20 focus:text-copa-ink">{tag}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="tag2" className={copaLabel}><Tag className="mr-2 h-4 w-4" />Etiqueta 2</label>
                  <Controller
                    name="tag2"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value} disabled={!tag1Value}>
                        <SelectTrigger id="tag2" className={copaInput}>
                          <SelectValue placeholder={!tag1Value ? 'Elige primero la etiqueta 1' : 'Selecciona una etiqueta'} />
                        </SelectTrigger>
                        <SelectContent className="border-copa-gold bg-copa-cream text-copa-ink rounded-none">
                          <SelectItem value={null} className="focus:bg-copa-gold/20 focus:text-copa-ink">Sin etiqueta</SelectItem>
                          {TAGS.filter(tag => tag !== tag1Value).map(tag => <SelectItem key={tag} value={tag} className="focus:bg-copa-gold/20 focus:text-copa-ink">{tag}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="image" className={copaLabel}>Imagen Principal</label>
              <div className="flex items-center gap-4">
                {imagePreview && <img src={imagePreview} alt="Vista previa" className="h-24 w-36 object-cover" />}
                <label className="copa-btn-secondary cursor-pointer inline-flex items-center">
                  <Upload className="mr-2 h-4 w-4" />
                  {imageFile ? 'Cambiar imagen' : 'Seleccionar imagen'}
                  <input id="image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className={copaLabel}>Contenido</label>
              <div className="copa-quill">
                <Controller
                  name="content"
                  control={control}
                  rules={{ required: 'El contenido no puede estar vacío.' }}
                  render={({ field }) => (
                    <ReactQuill
                      ref={quillRef}
                      theme="snow"
                      value={field.value}
                      onChange={field.onChange}
                      modules={modules}
                    />
                  )}
                />
              </div>
              {errors.content && <p className="text-red-600 text-sm mt-1">{errors.content.message}</p>}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArticleEditor;
