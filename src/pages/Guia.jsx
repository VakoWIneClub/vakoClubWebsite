
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Compass, Loader2, PlusCircle, Tag } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import ArticleList from '@/components/guia/ArticleList';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const TAGS = ["Bodegas", "Vinos", "Maridajes", "Regiones", "Experiencias"];

const Guia = () => {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const [activeTag, setActiveTag] = useState(queryParams.get('tag') || 'Todos');

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      let query = supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (activeTag && activeTag !== 'Todos') {
        query = query.or(`tag1.eq.${activeTag},tag2.eq.${activeTag}`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching articles:', error);
      } else {
        setArticles(data);
      }
      setLoading(false);
    };

    fetchArticles();
  }, [activeTag]);

  const handleTagClick = (tag) => {
    setActiveTag(tag);
    if (tag === 'Todos') {
      navigate('/guia');
    } else {
      navigate(`/guia?tag=${tag}`);
    }
  };

  const handleArticleDeleted = (deletedArticleId) => {
    setArticles(articles.filter(article => article.id !== deletedArticleId));
  };
  
  const isAdmin = user && user.role === 'admin';

  return (
    <>
      <Helmet>
        <title>Guía de Vinos - Vako Club</title>
        <meta name="description" content="Explora nuestras guías de vino en Vako Club. Aprende sobre cata, maridaje, regiones vinícolas y mucho más para convertirte en un experto." />
      </Helmet>

      <div className="min-h-screen wine-pattern pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <Compass className="h-16 w-16 mx-auto wine-text-gradient mb-4" />
            <h1 className="font-playfair text-5xl md:text-6xl font-bold wine-text-gradient">
              Guía de Vinos Vako Club
            </h1>
            <p className="mt-4 text-xl text-amber-100/80 max-w-3xl mx-auto">
              Tu brújula en el mundo del vino. Explora nuestros artículos y conviértete en un conocedor.
            </p>
          </motion.div>

          {isAdmin && (
             <div className="mb-8 text-center">
                <Button asChild size="lg">
                  <Link to="/guia/crear">
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Crear Nuevo Artículo
                  </Link>
                </Button>
            </div>
          )}

          <div className="mb-12 flex flex-wrap justify-center items-center gap-3">
            <Button
              variant={activeTag === 'Todos' ? 'default' : 'outline'}
              onClick={() => handleTagClick('Todos')}
              className="transition-all"
            >
              Todos
            </Button>
            {TAGS.map(tag => (
              <Button
                key={tag}
                variant={activeTag === tag ? 'default' : 'outline'}
                onClick={() => handleTagClick(tag)}
                className="transition-all"
              >
                <Tag className="mr-2 h-4 w-4" />
                {tag}
              </Button>
            ))}
          </div>

          {loading ? (
             <div className="flex justify-center items-center h-64">
                <Loader2 className="h-12 w-12 text-amber-300 animate-spin" />
             </div>
          ) : (
            <ArticleList 
              articles={articles} 
              isAdmin={isAdmin}
              onArticleDeleted={handleArticleDeleted}
              onTagClick={handleTagClick}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Guia;
