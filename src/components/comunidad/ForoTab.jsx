import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, CornerDownRight, PlusCircle, Edit, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const getInitials = (name) => {
  if (!name) return 'V';
  const names = name.split(' ');
  if (names.length > 1) {
    return `${names[0][0]}${names[names.length - 1][0]}`;
  }
  return name.substring(0, 2);
};

const ForoTab = () => {
  const { toast } = useToast();
  const { user } = useAuth();
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
        toast({ title: "¡Tema creado!", description: "Tu conversación ha comenzado." });
        fetchThreads();
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
        fetchThreads();
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
        <Loader2 className="h-12 w-12 animate-spin text-amber-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <Button size="lg" onClick={() => {
          if (!user) {
            toast({ title: "Inicia sesión", description: "Debes iniciar sesión para crear un tema.", variant: "destructive" });
            return;
          }
          setShowForm(!showForm)
        }}>
          <Edit className="mr-2 h-5 w-5" />
          {showForm ? 'Cancelar' : 'Iniciar Conversación'}
        </Button>
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
            <div className="wine-card rounded-2xl p-8 mt-4">
              <h3 className="font-playfair text-2xl font-semibold text-amber-200 mb-6 flex items-center gap-3">
                <MessageSquare className="h-8 w-8 wine-text-gradient" />
                Crear un Nuevo Tema de Discusión
              </h3>
              <form onSubmit={handleCreateThread} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title" className="text-amber-200">Título</Label>
                    <Input id="title" name="title" value={newThread.title} onChange={handleInputChange} placeholder="Un título atractivo para tu tema" />
                  </div>
                  <div>
                    <Label htmlFor="category" className="text-amber-200">Tema</Label>
                    <Input id="category" name="category" value={newThread.category} onChange={handleInputChange} placeholder="Ej: Maridajes, Recomendaciones" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="content" className="text-amber-200">Mensaje</Label>
                  <textarea
                    id="content"
                    name="content"
                    value={newThread.content}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full rounded-md border border-amber-500/20 bg-white/5 px-3 py-2 text-sm text-amber-100 ring-offset-background placeholder:text-amber-100/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                    placeholder="Escribe aquí tu pregunta o el tema que quieres discutir..."
                  ></textarea>
                </div>
                <div className="text-right">
                  <Button type="submit">
                    <Send className="mr-2 h-4 w-4" />
                    Publicar Tema
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        <h3 className="font-playfair text-3xl font-semibold text-amber-200 mt-12 mb-6 text-center">Últimas Conversaciones</h3>
        {displayedThreads.map((thread) => (
          <motion.div
            key={thread.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="wine-card rounded-2xl p-6"
          >
            <div className="flex items-start space-x-4">
               <Avatar>
                <AvatarImage src={thread.author?.avatar_url || ''} alt={thread.author?.name} />
                <AvatarFallback>{getInitials(thread.author?.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-amber-200 text-lg">{thread.title}</h4>
                    <p className="text-sm text-amber-100/60">
                      Por {thread.author?.name || 'Usuario Vako'} - {new Date(thread.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs whitespace-nowrap">{thread.category}</span>
                    {user && user.id === thread.user_id && (
                       <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:bg-red-500/10 hover:text-red-300">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. Se eliminará permanentemente el tema de la conversación y todas sus respuestas.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteThread(thread.id)} className="bg-red-600 hover:bg-red-700">
                                Sí, eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                    )}
                  </div>
                </div>
                <p className="mt-2 text-amber-100/80">{thread.content}</p>
              </div>
            </div>

            <div className="mt-4 pl-10 space-y-4">
              {thread.replies.map(reply => (
                <div key={reply.id} className="flex items-start space-x-3">
                  <CornerDownRight className="h-5 w-5 text-amber-400 mt-1" />
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={reply.author?.avatar_url || ''} alt={reply.author?.name} />
                    <AvatarFallback>{getInitials(reply.author?.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 bg-stone-800/50 rounded-lg p-3">
                    <p className="font-semibold text-amber-200 text-sm">{reply.author?.name || 'Usuario Vako'}</p>
                    <p className="text-amber-100/70 text-sm">{reply.content}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {user && (
                <div className="mt-4 pl-10">
                <div className="flex items-center gap-2">
                    <Input
                    value={replyContent[thread.id] || ''}
                    onChange={(e) => handleReplyChange(thread.id, e.target.value)}
                    placeholder="Escribe una respuesta..."
                    className="bg-stone-800/50"
                    />
                    <Button size="sm" onClick={() => handlePostReply(thread.id)}>
                    <Send className="h-4 w-4" />
                    </Button>
                </div>
                </div>
            )}
          </motion.div>
        ))}
        {threads.length > 5 && (
          <div className="text-center mt-8">
            <Button variant="outline" onClick={() => setShowAll(!showAll)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {showAll ? 'Mostrar Menos' : 'Mostrar Más Conversaciones'}
            </Button>
          </div>
        )}
         {threads.length === 0 && !loading && (
          <div className="text-center py-12">
            <MessageSquare className="mx-auto h-12 w-12 text-amber-100/30" />
            <h3 className="mt-2 text-lg font-medium text-amber-100/80">No hay conversaciones todavía.</h3>
            <p className="mt-1 text-sm text-amber-100/60">¡Sé el primero en iniciar una!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForoTab;