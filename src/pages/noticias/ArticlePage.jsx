import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, Calendar, User, ArrowLeft, Pencil, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import DOMPurify from 'dompurify';
import ArticleComments from '@/components/noticias/ArticleComments';

const ArticlePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [article, setArticle] = useState(null);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const isAdmin = user && user.role === 'admin';

  const fetchArticle = useCallback(async () => {
    setLoading(true);
    setError(false);
    
    const { data: articleData, error: articleError } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .single();

    if (articleError || !articleData) {
      console.error('Error fetching article:', articleError);
      setError(true);
      setLoading(false);
      return;
    }
    
    setArticle(articleData);

    if (articleData.author_id) {
      const { data: authorData, error: authorError } = await supabase
        .from('profiles')
        .select('name, avatar_url')
        .eq('id', articleData.author_id)
        .single();
      
      if (authorError) {
        console.error('Error fetching author:', authorError);
      } else {
        setAuthor(authorData);
      }
    }
    
    setLoading(false);
  }, [slug]);

  useEffect(() => {
    fetchArticle();
  }, [fetchArticle]);

  const createSnippet = (htmlContent) => {
    if (!htmlContent) return "";
    const cleanHtml = DOMPurify.sanitize(htmlContent);
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = cleanHtml;
    return (tempDiv.textContent || tempDiv.innerText || "").substring(0, 160);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-16 w-16 text-amber-300 animate-spin" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="text-center py-20 px-4">
        <h1 className="font-playfair text-4xl text-amber-200">Artículo no encontrado</h1>
        <p className="text-amber-100/70 mt-4">El artículo que buscas no existe o ha sido eliminado.</p>
        <Button asChild className="mt-8">
          <Link to="/noticias">
            Volver a Noticias
          </Link>
        </Button>
      </div>
    );
  }

  const formattedDate = format(new Date(article.created_at), "d 'de' MMMM, yyyy", { locale: es });
  const sanitizedContent = DOMPurify.sanitize(article.content);
  const tags = [article.tag1, article.tag2].filter(Boolean);

  return (
    <>
      <Helmet>
        <title>{`${article.title} - Noticias de Vako Club`}</title>
        <meta name="description" content={createSnippet(article.content)} />
      </Helmet>

      <div className="wine-pattern pt-12 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-8">
              <Button asChild variant="ghost" className="text-amber-300 hover:text-amber-100 group">
                <Link to="/noticias">
                  <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  Volver a Noticias
                </Link>
              </Button>
              {isAdmin && (
                <Button asChild>
                  <Link to={`/noticias/editar/${article.slug}`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar Artículo
                  </Link>
                </Button>
              )}
            </div>

            <article className="wine-card rounded-2xl p-8 md:p-12">
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {tags.map(tag => (
                    <Button
                      key={tag}
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/noticias?tag=${tag}`)}
                      className="text-xs"
                    >
                      <Tag className="mr-2 h-3 w-3" />
                      {tag}
                    </Button>
                  ))}
                </div>
              )}
              <h1 className="font-playfair text-4xl md:text-5xl font-bold wine-text-gradient mb-6">
                {article.title}
              </h1>
              
              <div className="flex items-center space-x-6 text-amber-100/70 mb-8 border-b border-t border-amber-200/10 py-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-amber-300/80" />
                  <span>{formattedDate}</span>
                </div>
                {author && (
                  <div className="flex items-center">
                    {author.avatar_url ? (
                      <img src={author.avatar_url} alt={author.name} className="h-6 w-6 rounded-full mr-2" />
                    ) : (
                      <User className="h-5 w-5 mr-2 text-amber-300/80" />
                    )}
                    <span>{author.name || 'Autor Desconocido'}</span>
                  </div>
                )}
              </div>

              {article.image_url && (
                <div className="my-8 rounded-lg overflow-hidden shadow-lg shadow-black/20">
                  <img src={article.image_url} alt={article.title} className="w-full h-auto object-cover" />
                </div>
              )}

              <div className="prose prose-lg prose-invert max-w-none 
                prose-headings:font-playfair prose-headings:text-amber-200 prose-headings:mb-4 prose-headings:mt-8
                prose-p:text-amber-100/80 prose-p:leading-relaxed
                prose-a:text-amber-300 hover:prose-a:text-amber-100 prose-a:transition-colors
                prose-strong:text-amber-100
                prose-blockquote:border-l-amber-400 prose-blockquote:text-amber-100/60 prose-blockquote:pl-4 prose-blockquote:italic
                prose-ul:list-disc prose-ul:pl-6 prose-li:text-amber-100/80 prose-li:my-2
                prose-ol:list-decimal prose-ol:pl-6 prose-li:text-amber-100/80 prose-li:my-2
                prose-img:rounded-lg prose-img:shadow-md prose-img:shadow-black/20 prose-img:mx-auto prose-img:my-8
                prose-table:w-full prose-table:border-collapse prose-table:border prose-table:border-amber-200/20
                prose-thead:border-b prose-thead:border-amber-200/30
                prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:font-semibold prose-th:text-amber-200
                prose-tbody:divide-y prose-tbody:divide-amber-200/10
                prose-tr:border-b prose-tr:border-amber-200/10
                prose-td:px-4 prose-td:py-2 prose-td:text-amber-100/80
              " dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
            </article>

            <section id="comments" className="mt-12">
               <ArticleComments articleId={article.id} />
            </section>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ArticlePage;