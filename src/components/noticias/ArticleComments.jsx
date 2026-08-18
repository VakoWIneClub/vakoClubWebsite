import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, MessageSquare, Send, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

const ArticleComments = ({ articleId }) => {
  const { user, profile } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('article_comments')
        .select(`
          id,
          content,
          created_at,
          user_id,
          profiles (
            name,
            avatar_url
          )
        `)
        .eq('article_id', articleId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching comments:', error);
        toast({ variant: 'destructive', title: 'Error al cargar comentarios', description: 'No se pudieron obtener los comentarios.' });
      } else {
        setComments(data);
      }
      setLoading(false);
    };

    if (articleId) {
      fetchComments();
    }
  }, [articleId, toast]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!user) {
      toast({ variant: 'destructive', title: 'Acción requerida', description: 'Debes iniciar sesión para comentar.' });
      return;
    }

    setSubmitting(true);
    const { data, error } = await supabase
      .from('article_comments')
      .insert({
        content: newComment,
        article_id: articleId,
        user_id: user.id,
      })
      .select(`
        id,
        content,
        created_at,
        user_id,
        profiles (
          name,
          avatar_url
        )
      `)
      .single();

    if (error) {
      toast({ variant: 'destructive', title: 'Error al enviar', description: error.message });
    } else {
      setComments(prevComments => [data, ...prevComments]);
      setNewComment('');
      toast({ title: 'Comentario añadido', description: 'Tu comentario ha sido publicado.' });
    }
    setSubmitting(false);
  };

  const handleDeleteComment = async (commentId) => {
    const { error } = await supabase
      .from('article_comments')
      .delete()
      .eq('id', commentId);

    if (error) {
      toast({ variant: 'destructive', title: 'Error al eliminar', description: error.message });
    } else {
      setComments(comments.filter(comment => comment.id !== commentId));
      toast({ title: 'Comentario eliminado' });
    }
  };

  return (
    <div className="border border-copa-gold p-8">
      <h2 className="font-cormorant font-light flex items-center" style={{ fontSize: 28 }}>
        <MessageSquare className="mr-3 h-6 w-6 text-copa-gold" />
        Comentarios ({comments.length})
      </h2>

      {user ? (
        <form onSubmit={handleSubmitComment} className="mb-8 mt-6">
          <div className="flex items-start gap-4">
            <Avatar>
              <AvatarImage src={profile?.avatar_url} alt={profile?.name} />
              <AvatarFallback className="bg-copa-burgundy text-copa-cream">{profile?.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escribe tu comentario aquí..."
                className="rounded-none border-copa-gold bg-copa-cream text-copa-ink placeholder:text-copa-ink/40 focus-visible:ring-1 focus-visible:ring-copa-burgundy mb-3"
                rows={3}
              />
              <button type="submit" disabled={submitting || !newComment.trim()} className="copa-btn-nav inline-flex items-center">
                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Enviar Comentario
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="text-center border border-copa-gold bg-copa-creamDeep p-6 mt-6 mb-8">
          <p className="text-copa-ink/75 mb-4">¿Quieres unirte a la conversación? Inicia sesión para dejar un comentario.</p>
          <Link to="/login" className="copa-btn-primary inline-flex">Iniciar Sesión</Link>
        </div>
      )}

      <div className="space-y-6 mt-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-7 w-7 text-copa-burgundy animate-spin" />
          </div>
        ) : comments.length > 0 ? (
          comments.map(comment => (
            <div key={comment.id} className="flex items-start gap-4">
              <Avatar>
                <AvatarImage src={comment.profiles?.avatar_url} alt={comment.profiles?.name} />
                <AvatarFallback className="bg-copa-burgundy text-copa-cream">{comment.profiles?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-copa-ink">{comment.profiles?.name || 'Anónimo'}</p>
                    <p className="font-jost text-[10px] tracking-[0.1em] uppercase text-copa-ink/50 mt-0.5">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: es })}
                    </p>
                  </div>
                  {user && user.id === comment.user_id && (
                    <button
                      type="button"
                      onClick={() => handleDeleteComment(comment.id)}
                      aria-label="Eliminar comentario"
                      className="h-8 w-8 flex items-center justify-center text-copa-ink/40 hover:text-copa-burgundy transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <p className="mt-2 text-copa-ink/80 whitespace-pre-wrap" style={{ lineHeight: 1.6 }}>{comment.content}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-copa-ink/60 py-8">Aún no hay comentarios. ¡Sé el primero en opinar!</p>
        )}
      </div>
    </div>
  );
};

export default ArticleComments;
