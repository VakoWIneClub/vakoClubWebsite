import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Upload, ImagePlus } from 'lucide-react';

const ArticleForm = ({ onArticleCreated, onArticleUpdated, articleToEdit }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(articleToEdit?.image_url || null);
  const contentValue = watch('content', articleToEdit?.content || '');
  const contentRef = useRef(null);

  useEffect(() => {
    if (articleToEdit) {
      setValue('title', articleToEdit.title);
      setValue('content', articleToEdit.content);
      setImagePreview(articleToEdit.image_url);
    }
  }, [articleToEdit, setValue]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return articleToEdit?.image_url || null;

    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${user.id}_${Date.now()}.${fileExt}`;
    const filePath = `public/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('article-images')
      .upload(filePath, imageFile);

    if (uploadError) {
      throw new Error(`Error al subir imagen principal: ${uploadError.message}`);
    }

    const { data } = supabase.storage.from('article-images').getPublicUrl(filePath);
    return data.publicUrl;
  };
  
  const handleContentImageUpload = async (file) => {
    setIsSubmitting(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}_content_${Date.now()}.${fileExt}`;
      const filePath = `public/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('article-images')
        .upload(filePath, file);

      if (uploadError) {
        throw new Error(`Error al subir imagen de contenido: ${uploadError.message}`);
      }

      const { data } = supabase.storage.from('article-images').getPublicUrl(filePath);
      const markdownImage = `\n![${file.name}](${data.publicUrl})\n`;
      
      const textarea = contentRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = contentValue.substring(0, start) + markdownImage + contentValue.substring(end);
      
      setValue('content', newContent, { shouldValidate: true });
      
      toast({
        title: "Imagen insertada",
        description: "La imagen se ha añadido al contenido del artículo.",
      });

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al subir imagen",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onContentImageSelected = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleContentImageUpload(file);
    }
    e.target.value = null; // Reset file input
  };

  const onSubmit = async (formData) => {
    if (!user) {
      toast({ variant: "destructive", title: "No autenticado", description: "Debes iniciar sesión para crear un artículo." });
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

      if (articleToEdit) {
        // Update existing article
        const { data, error } = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', articleToEdit.id)
          .select()
          .single();

        if (error) throw error;
        toast({ title: "Artículo actualizado", description: "El artículo ha sido modificado con éxito." });
        if (onArticleUpdated) onArticleUpdated(data);
      } else {
        // Create new article
        const { data, error } = await supabase
          .from('articles')
          .insert(articleData)
          .select()
          .single();

        if (error) throw error;
        toast({ title: "Artículo creado", description: "Tu nuevo artículo ha sido publicado en la guía." });
        if (onArticleCreated) onArticleCreated(data);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al guardar el artículo",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-amber-200">Título del Artículo</Label>
        <Input
          id="title"
          {...register('title', { required: 'El título es obligatorio' })}
          className="wine-input"
          placeholder="Ej: La historia del Malbec"
        />
        {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="image" className="text-amber-200">Imagen Principal (Opcional)</Label>
        <div className="flex items-center gap-4">
          {imagePreview && <img src={imagePreview} alt="Vista previa" className="h-20 w-20 rounded-lg object-cover" />}
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
        <div className="flex justify-between items-center">
          <Label htmlFor="content" className="text-amber-200">Contenido</Label>
          <Button asChild size="sm" variant="ghost">
            <label className="cursor-pointer text-amber-300">
              <ImagePlus className="mr-2 h-4 w-4" />
              Insertar Imagen
              <input type="file" accept="image/*" onChange={onContentImageSelected} className="hidden" />
            </label>
          </Button>
        </div>
        <Textarea
          id="content"
          {...register('content', { required: 'El contenido no puede estar vacío' })}
          ref={contentRef}
          className="wine-input min-h-[250px]"
          placeholder="Escribe tu artículo aquí. Puedes usar Markdown para dar formato (ej: # Título, *cursiva*, **negrita**)."
        />
        <p className="text-xs text-amber-100/60">
          Soporta Markdown para títulos, listas, negritas, etc.
        </p>
        {errors.content && <p className="text-red-400 text-sm mt-1">{errors.content.message}</p>}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting} size="lg">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {articleToEdit ? 'Guardar Cambios' : 'Publicar Artículo'}
        </Button>
      </div>
    </form>
  );
};

export default ArticleForm;