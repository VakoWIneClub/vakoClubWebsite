
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, MessageSquare, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Comment = ({ comment, onDelete }) => {
  const { user } = useAuth();
  const canDelete = user && user.id === comment.user_id;

  const handleDelete = () => {
    onDelete(comment.id);
  };

  return (
    <div className="flex items-start space-x-4">
      <Avatar>
        <AvatarImage src={comment.profiles?.avatar_url} alt={comment.profiles?.name} />
        <AvatarFallback>{comment.profiles?.name?.charAt(0) || 'U'}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-amber-100">{comment.profiles?.name || 'Usuario'}</p>
          {canDelete && (
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 text-red-400" />
            </Button>
          )}
        </div>
        <p className="text-sm text-amber-100/70 mb-1">
          hace {formatDistanceToNow(new Date(comment.created_at), { locale: es })}
        </p>
        <p className="text-amber-100/90 whitespace-pre-wrap">{comment.content}</p>
      </div>
    </div>
  );
};

const ArticleComments = ({ articleId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchComments = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('article_comments')
      .select('*, profiles(name, avatar_url)')
      .eq('article_id', articleId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching comments:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudieron cargar los comentarios.' });
    } else {
      setComments(data);
    }
    setLoading(false);
  }, [articleId, toast]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setSubmitting(true);
    const { error } = await supabase.from('article_comments').insert({
      article_id: articleId,
      user_id: user.id,
      content: newComment.trim(),
    });

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo publicar tu comentario.' });
    } else {
      setNewComment('');
      toast({ title: '¡Comentario publicado!' });
      await fetchComments();
    }
    setSubmitting(false);
  };
  
  const handleDeleteComment = async (commentId) => {
    const { error } = await supabase.from('article_comments').delete().eq('id', commentId);
    if(error) {
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo eliminar el comentario.' });
    } else {
      toast({ title: 'Comentario eliminado.' });
      setComments(comments.filter(c => c.id !== commentId));
    }
  };

  return (
    <div className="wine-card rounded-2xl p-8">
      <h2 className="font-playfair text-3xl font-bold wine-text-gradient mb-6 flex items-center">
        <MessageSquare className="mr-3 h-7 w-7" />
        Comentarios ({comments.length})
      </h2>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-8 space-y-4">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escribe tu comentario aquí..."
            className="min-h-[100px]"
            disabled={submitting}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={submitting || !newComment.trim()}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Publicar
            </Button>
          </div>
        </form>
      ) : (
        <div className="text-center p-6 border border-amber-500/20 rounded-lg mb-8 bg-black/20">
          <p className="text-amber-100/80 mb-4">¿Quieres unirte a la conversación?</p>
          <Button asChild>
            <Link to="/login">Inicia sesión para comentar</Link>
          </Button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 text-amber-300 animate-spin" />
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <Comment key={comment.id} comment={comment} onDelete={handleDeleteComment} />
          ))}
        </div>
      ) : (
        <p className="text-center text-amber-100/70 py-8">
          Aún no hay comentarios. ¡Sé el primero en compartir tu opinión!
        </p>
      )}
    </div>
  );
};

export default ArticleComments;
