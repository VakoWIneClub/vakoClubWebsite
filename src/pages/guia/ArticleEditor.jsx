import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Upload, Save, ArrowLeft } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '@/quill-custom.css';

const ArticleEditor = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { register, handleSubmit, setValue, control, formState: { errors } } = useForm();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [article, setArticle] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const quillRef = useRef(null);

  const isEditing = !!slug;

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

      if (error || !data) {
        toast({ variant: "destructive", title: "Error", description: "No se pudo cargar el artículo para editar." });
        navigate('/guia');
      } else {
        setArticle(data);
        setValue('title', data.title);
        setValue('content', data.content);
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
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
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
        toast({ title: "Artículo creado", description: "Tu nuevo artículo ha sido publicado." });
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
      <Helmet>
        <title>{isEditing ? 'Editando Artículo' : 'Crear Nuevo Artículo'} - Vako Club</title>
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex justify-between items-center">
            <Button type="button" variant="ghost" onClick={() => navigate('/guia')} className="text-amber-200">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a la Guía
            </Button>
            <h1 className="font-playfair text-3xl md:text-4xl font-bold wine-text-gradient">
              {isEditing ? 'Editar Artículo' : 'Crear Nuevo Artículo'}
            </h1>
            <Button type="submit" disabled={isSubmitting} size="lg">
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {isEditing ? 'Guardar Cambios' : 'Publicar'}
            </Button>
          </div>

          <div className="wine-card p-8 rounded-2xl space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-amber-200 text-lg">Título</Label>
              <Input
                id="title"
                {...register('title', { required: 'El título es obligatorio' })}
                className="wine-input text-xl"
                placeholder="Un título cautivador para tu artículo"
              />
              {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="image" className="text-amber-200 text-lg">Imagen Principal</Label>
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

            <div className="space-y-2">
              <Label className="text-amber-200 text-lg">Contenido</Label>
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
                    className="bg-white/5 text-amber-100 rounded-md"
                  />
                )}
              />
              {errors.content && <p className="text-red-400 text-sm mt-1">{errors.content.message}</p>}
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default ArticleEditor;