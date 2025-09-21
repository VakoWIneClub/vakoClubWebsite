import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
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
    <div className="wine-card rounded-2xl p-8">
      <h2 className="font-playfair text-3xl font-bold wine-text-gradient mb-6 flex items-center">
        <MessageSquare className="mr-3 h-7 w-7" />
        Comentarios ({comments.length})
      </h2>

      {user ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="flex items-start space-x-4">
            <Avatar>
              <AvatarImage src={profile?.avatar_url} alt={profile?.name} />
              <AvatarFallback>{profile?.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escribe tu comentario aquí..."
                className="wine-input mb-2"
                rows={3}
              />
              <Button type="submit" disabled={submitting || !newComment.trim()}>
                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Enviar Comentario
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <div className="text-center wine-glass-effect rounded-lg p-6 mb-8">
          <p className="text-amber-100/80 mb-4">¿Quieres unirte a la conversación? Inicia sesión para dejar un comentario.</p>
          <Button asChild>
            <Link to="/login">Iniciar Sesión</Link>
          </Button>
        </div>
      )}

      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 text-amber-300 animate-spin" />
          </div>
        ) : comments.length > 0 ? (
          comments.map(comment => (
            <div key={comment.id} className="flex items-start space-x-4">
              <Avatar>
                <AvatarImage src={comment.profiles?.avatar_url} alt={comment.profiles?.name} />
                <AvatarFallback>{comment.profiles?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-amber-200">{comment.profiles?.name || 'Anónimo'}</p>
                    <p className="text-xs text-amber-100/60">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: es })}
                    </p>
                  </div>
                  {user && user.id === comment.user_id && (
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteComment(comment.id)} className="h-8 w-8">
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </Button>
                  )}
                </div>
                <p className="mt-2 text-amber-100/90 whitespace-pre-wrap">{comment.content}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-amber-100/70 py-8">Aún no hay comentarios. ¡Sé el primero en opinar!</p>
        )}
      </div>
    </div>
  );
};

export default ArticleComments;