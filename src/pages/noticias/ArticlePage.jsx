import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, Calendar, User, ArrowLeft, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
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
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] bg-copa-cream">
        <Loader2 className="h-14 w-14 text-copa-burgundy animate-spin" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="text-center py-20 px-4 bg-copa-cream min-h-screen" style={{ fontFamily: "'EB Garamond', serif" }}>
        <h1 className="font-cormorant font-light" style={{ fontSize: 36 }}>Artículo no encontrado</h1>
        <p className="text-copa-ink/70 mt-4">El artículo que buscas no existe o ha sido eliminado.</p>
        <Link to="/noticias" className="copa-btn-primary mt-8 inline-flex">
          Volver a Noticias
        </Link>
      </div>
    );
  }

  const formattedDate = format(new Date(article.created_at), "d 'de' MMMM, yyyy", { locale: es });
  // FORBID_ATTR strips legacy inline color spans (baked in from the old dark theme) that
  // would otherwise override the copa prose-* classes below, since inline styles always
  // win over CSS classes regardless of specificity.
  const sanitizedContent = DOMPurify.sanitize(article.content, { FORBID_ATTR: ['style'] });
  const tags = [article.tag1, article.tag2].filter(Boolean);

  return (
    <div className="bg-copa-cream text-copa-ink" style={{ fontFamily: "'EB Garamond', serif" }}>
      <Helmet>
        <title>{`${article.title} - Noticias de Vako Club`}</title>
        <meta name="description" content={createSnippet(article.content)} />
      </Helmet>

      <div className="pt-12 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
              <Link to="/noticias" className="copa-link-nav font-jost text-[11px] tracking-[0.14em] uppercase inline-flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a Noticias
              </Link>
              {isAdmin && (
                <Link to={`/noticias/editar/${article.slug}`} className="copa-btn-nav inline-flex items-center">
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar Artículo
                </Link>
              )}
            </div>

            <article className="border border-copa-gold p-8 md:p-12">
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {tags.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => navigate(`/noticias?tag=${tag}`)}
                      className="font-jost text-[10px] tracking-[0.1em] uppercase border border-copa-gold text-copa-ink/70 px-2.5 py-1 hover:border-copa-burgundy hover:text-copa-burgundy transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
              <h1 className="font-cormorant font-light leading-[1.05]" style={{ fontSize: 'clamp(32px,5vw,48px)' }}>
                {article.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-copa-ink/60 mt-8 border-b border-t border-copa-gold/40 py-4 font-jost text-[11px] tracking-[0.12em] uppercase">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-copa-gold" />
                  <span>{formattedDate}</span>
                </div>
                {author && (
                  <div className="flex items-center">
                    {author.avatar_url ? (
                      <img src={author.avatar_url} alt={author.name} className="h-6 w-6 rounded-full mr-2" />
                    ) : (
                      <User className="h-4 w-4 mr-2 text-copa-gold" />
                    )}
                    <span>{author.name || 'Autor Desconocido'}</span>
                  </div>
                )}
              </div>

              {article.image_url && (
                <div className="my-8">
                  <img src={article.image_url} alt={article.title} className="w-full h-auto object-cover" />
                </div>
              )}

              <div
                className="prose prose-lg max-w-none
                  prose-headings:font-cormorant prose-headings:font-normal prose-headings:text-copa-ink prose-headings:mb-4 prose-headings:mt-10
                  prose-p:text-copa-ink/80 prose-p:leading-relaxed
                  prose-a:text-copa-burgundy prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-copa-ink prose-strong:font-semibold
                  prose-blockquote:border-l-copa-gold prose-blockquote:text-copa-ink/60 prose-blockquote:pl-4 prose-blockquote:italic
                  prose-ul:list-disc prose-ul:pl-6 prose-li:text-copa-ink/80 prose-li:my-2
                  prose-ol:list-decimal prose-ol:pl-6 prose-li:text-copa-ink/80 prose-li:my-2
                  prose-img:rounded-none prose-img:shadow-md prose-img:shadow-copa-ink/20 prose-img:mx-auto prose-img:my-8
                  prose-table:w-full prose-table:border-collapse prose-table:border prose-table:border-copa-gold/40
                  prose-thead:border-b prose-thead:border-copa-gold/50
                  prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:font-semibold prose-th:text-copa-ink
                  prose-tbody:divide-y prose-tbody:divide-copa-gold/20
                  prose-tr:border-b prose-tr:border-copa-gold/20
                  prose-td:px-4 prose-td:py-2 prose-td:text-copa-ink/80
                "
                style={{ fontFamily: "'EB Garamond', serif" }}
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
              />
            </article>

            <section id="comments" className="mt-12">
               <ArticleComments articleId={article.id} />
            </section>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;
