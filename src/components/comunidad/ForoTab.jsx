import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, CornerDownRight, PlusCircle, Edit, Loader2, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const copaInput = 'rounded-none border-copa-gold bg-copa-cream text-copa-ink placeholder:text-copa-ink/40 focus-visible:ring-1 focus-visible:ring-copa-burgundy';
const copaLabel = 'font-jost text-[11px] tracking-[0.14em] uppercase text-copa-ink/70';

const getInitials = (name) => {
  if (!name) return 'V';
  const names = name.split(' ');
  if (names.length > 1) {
    return `${names[0][0]}${names[names.length - 1][0]}`;
  }
  return name.substring(0, 2);
};

const DeleteThreadDialog = ({ onConfirm }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    await onConfirm();
    setIsLoading(false);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          aria-label="Eliminar tema"
          className="h-8 w-8 flex items-center justify-center text-copa-ink/40 hover:text-copa-burgundy transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </AlertDialogTrigger>
      {/* AlertDialogContent's base classes bake in .wine-glass-effect (a plain, un-layered CSS
          rule that beats any className background override regardless of order) — style forces
          it off, same workaround used throughout the copa redesign. */}
      <AlertDialogContent
        className="bg-copa-cream border-copa-gold rounded-none text-copa-ink"
        style={{ backgroundColor: '#F7F1E6', backdropFilter: 'none' }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="font-cormorant font-light text-copa-ink" style={{ fontSize: 26 }}>
            ¿Estás seguro?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-copa-ink/70" style={{ fontFamily: "'EB Garamond', serif", fontSize: 16 }}>
            Esta acción no se puede deshacer. Se eliminará permanentemente el tema de la conversación y todas sus respuestas.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {/* Not asChild + a plain <button>: AlertDialogAction/Cancel always inject
              buttonVariants() via cn(buttonVariants(), className), which beats copa-btn-*
              component-layer classes regardless of order — passing real utilities straight to
              className runs through one real cn()/twMerge call, which dedupes correctly. */}
          <AlertDialogCancel
            disabled={isLoading}
            className="rounded-none h-auto bg-transparent hover:bg-transparent border-0 border-b border-copa-gold px-0 py-1.5 font-jost text-xs tracking-[0.14em] uppercase text-copa-ink hover:text-copa-burgundy hover:border-copa-burgundy"
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className="rounded-none h-auto bg-copa-burgundy hover:bg-copa-ink text-copa-cream px-8 py-[19px] font-jost text-xs font-medium tracking-[0.14em] uppercase"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                Eliminando…
              </>
            ) : (
              'Sí, eliminar'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const ForoTab = () => {
  const { toast } = useToast();
  const { user, refreshUser } = useAuth();
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newThread, setNewThread] = useState({ title: '', category: '', content: '' });
  const [replyContent, setReplyContent] = useState({});
  const [showAll, setShowAll] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchThreads = useCallback(async () => {
    setLoading(true);
    const { data: threadsData, error: threadsError } = await supabase
      .from('threads_with_author_profile')
      .select('*')
      .order('created_at', { ascending: false });

    if (threadsError) {
      toast({ title: "Error", description: "No se pudieron cargar los temas del foro.", variant: "destructive" });
      setLoading(false);
      return;
    }

    const threadIds = threadsData.map(t => t.id);
    const { data: repliesData, error: repliesError } = await supabase
      .from('replies_with_author_profile')
      .select('*')
      .in('thread_id', threadIds)
      .order('created_at', { ascending: true });

    if (repliesError) {
      toast({ title: "Error", description: "No se pudieron cargar las respuestas.", variant: "destructive" });
    }

    const threadsWithReplies = threadsData.map(thread => ({
      ...thread,
      author: thread.author || { name: 'Usuario Anónimo', avatar_url: null },
      replies: (repliesData || [])
        .filter(reply => reply.thread_id === thread.id)
        .map(reply => ({ ...reply, author: reply.author || { name: 'Usuario Anónimo', avatar_url: null } }))
    }));

    setThreads(threadsWithReplies);
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewThread(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateThread = async (e) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Acceso denegado", description: "Debes iniciar sesión para crear un tema.", variant: "destructive" });
      return;
    }
    if (newThread.title && newThread.category && newThread.content) {
      const { error } = await supabase
        .from('threads')
        .insert([{
          title: newThread.title,
          content: newThread.content,
          category: newThread.category,
          user_id: user.id
        }]);

      if (error) {
        toast({ title: "Error al crear tema", description: error.message, variant: "destructive" });
      } else {
        setNewThread({ title: '', category: '', content: '' });
        setShowForm(false);
        toast({ title: "¡Tema creado!", description: "Tu conversación ha comenzado. ¡Has ganado 10 puntos!" });
        fetchThreads();
        refreshUser();
      }
    } else {
      toast({ title: "Campos incompletos", description: "Por favor, rellena todos los campos.", variant: "destructive" });
    }
  };

  const handleReplyChange = (threadId, value) => {
    setReplyContent(prev => ({ ...prev, [threadId]: value }));
  };

  const handlePostReply = async (threadId) => {
    if (!user) {
      toast({ title: "Acceso denegado", description: "Debes iniciar sesión para responder.", variant: "destructive" });
      return;
    }
    const content = replyContent[threadId];
    if (content && content.trim()) {
      const { error } = await supabase
        .from('replies')
        .insert([{
          content: content,
          thread_id: threadId,
          user_id: user.id
        }]);

      if (error) {
        toast({ title: "Error al responder", description: error.message, variant: "destructive" });
      } else {
        setReplyContent(prev => ({ ...prev, [threadId]: '' }));
        toast({ title: "¡Respuesta enviada!", description: "¡Has ganado 10 puntos!" });
        fetchThreads();
        refreshUser();
      }
    }
  };

  const handleDeleteThread = async (threadId) => {
    if (!user) {
      toast({ title: "Acceso denegado", description: "No tienes permiso para hacer esto.", variant: "destructive" });
      return;
    }

    const { error } = await supabase.from('threads').delete().match({ id: threadId, user_id: user.id });

    if (error) {
      toast({ title: "Error al eliminar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "¡Eliminado!", description: "El tema de conversación ha sido eliminado." });
      fetchThreads();
    }
  };

  const displayedThreads = showAll ? threads : threads.slice(0, 5);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-16">
        <Loader2 className="h-10 w-10 animate-spin text-copa-burgundy" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <button
          type="button"
          className="copa-btn-primary inline-flex items-center"
          onClick={() => {
            if (!user) {
              toast({ title: "Inicia sesión", description: "Debes iniciar sesión para crear un tema.", variant: "destructive" });
              return;
            }
            setShowForm(!showForm);
          }}
        >
          <Edit className="mr-2 h-5 w-5" />
          {showForm ? 'Cancelar' : 'Iniciar Conversación'}
        </button>
      </div>

      <AnimatePresence>
        {showForm && user && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="border border-copa-gold bg-copa-creamDeep p-8 mt-4">
              <h3 className="font-cormorant font-light flex items-center gap-3" style={{ fontSize: 26 }}>
                <MessageSquare className="h-6 w-6 text-copa-gold" />
                Crear un Nuevo Tema de Discusión
              </h3>
              <form onSubmit={handleCreateThread} className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="title" className={copaLabel}>Título</label>
                    <Input id="title" name="title" value={newThread.title} onChange={handleInputChange} placeholder="Un título atractivo para tu tema" className={copaInput} />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="category" className={copaLabel}>Tema</label>
                    <Input id="category" name="category" value={newThread.category} onChange={handleInputChange} placeholder="Ej: Maridajes, Recomendaciones" className={copaInput} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="content" className={copaLabel}>Mensaje</label>
                  <textarea
                    id="content"
                    name="content"
                    value={newThread.content}
                    onChange={handleInputChange}
                    rows="4"
                    className={`w-full px-3 py-2 text-sm ${copaInput}`}
                    placeholder="Escribe aquí tu pregunta o el tema que quieres discutir..."
                  ></textarea>
                </div>
                <div className="text-right">
                  <button type="submit" className="copa-btn-nav inline-flex items-center">
                    <Send className="mr-2 h-4 w-4" />
                    Publicar Tema
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        <h3 className="font-cormorant font-light mt-12 mb-6 text-center" style={{ fontSize: 30 }}>Últimas Conversaciones</h3>
        {displayedThreads.map((thread) => (
          <motion.div
            key={thread.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="copa-card p-6"
          >
            <div className="flex items-start space-x-4">
              <Avatar>
                <AvatarImage src={thread.author?.avatar_url || ''} alt={thread.author?.name} />
                <AvatarFallback className="bg-copa-burgundy text-copa-cream">{getInitials(thread.author?.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <h4 className="font-cormorant" style={{ fontSize: 20 }}>{thread.title}</h4>
                    <p className="font-jost text-[10px] tracking-[0.1em] uppercase text-copa-ink/50 mt-0.5">
                      Por {thread.author?.name || 'Usuario Vako'} — {new Date(thread.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="font-jost text-[10px] tracking-[0.1em] uppercase border border-copa-gold text-copa-ink/70 px-2.5 py-1 whitespace-nowrap">{thread.category}</span>
                    {user && user.id === thread.user_id && (
                      <DeleteThreadDialog onConfirm={() => handleDeleteThread(thread.id)} />
                    )}
                  </div>
                </div>
                <p className="mt-2 text-copa-ink/80" style={{ lineHeight: 1.6 }}>{thread.content}</p>
              </div>
            </div>

            <div className="mt-4 pl-14 space-y-4">
              {thread.replies.map(reply => (
                <div key={reply.id} className="flex items-start space-x-3">
                  <CornerDownRight className="h-4 w-4 text-copa-gold mt-2 shrink-0" />
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={reply.author?.avatar_url || ''} alt={reply.author?.name} />
                    <AvatarFallback className="bg-copa-burgundy text-copa-cream text-xs">{getInitials(reply.author?.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 border border-copa-gold/40 p-3">
                    <p className="font-jost text-[10px] tracking-[0.1em] uppercase text-copa-ink/60">{reply.author?.name || 'Usuario Vako'}</p>
                    <p className="text-copa-ink/80 text-sm mt-1">{reply.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {user && (
              <div className="mt-4 pl-14">
                <div className="flex items-center gap-2">
                  <Input
                    value={replyContent[thread.id] || ''}
                    onChange={(e) => handleReplyChange(thread.id, e.target.value)}
                    placeholder="Escribe una respuesta..."
                    className={copaInput}
                  />
                  <button type="button" onClick={() => handlePostReply(thread.id)} className="copa-btn-nav h-10 w-10 flex items-center justify-center px-0">
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
        {threads.length > 5 && (
          <div className="text-center mt-8">
            <button type="button" onClick={() => setShowAll(!showAll)} className="copa-btn-secondary inline-flex items-center">
              <PlusCircle className="mr-2 h-4 w-4" />
              {showAll ? 'Mostrar Menos' : 'Mostrar Más Conversaciones'}
            </button>
          </div>
        )}
        {threads.length === 0 && !loading && (
          <div className="text-center py-12">
            <MessageSquare className="mx-auto h-12 w-12 text-copa-gold/60" />
            <h3 className="font-cormorant mt-3" style={{ fontSize: 22 }}>No hay conversaciones todavía.</h3>
            <p className="text-copa-ink/60 mt-1">¡Sé el primero en iniciar una!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForoTab;
