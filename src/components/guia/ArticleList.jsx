
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Pencil, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import DeleteArticleDialog from '@/components/guia/DeleteArticleDialog';
import { Button } from '@/components/ui/button';
import DOMPurify from 'dompurify';

const ArticleCard = ({ article, index, isAdmin, onArticleDeleted, onTagClick }) => {
  const formattedDate = format(new Date(article.created_at), "d 'de' MMMM, yyyy", { locale: es });

  const handleAdminActionClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleTagClick = (e, tag) => {
    e.preventDefault();
    e.stopPropagation();
    onTagClick(tag);
  };

  const createSnippet = (htmlContent) => {
    const cleanHtml = DOMPurify.sanitize(htmlContent, { ALLOWED_TAGS: ['p', 'br'] });
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = cleanHtml;
    return tempDiv.textContent || tempDiv.innerText || "";
  };
  
  const tags = [article.tag1, article.tag2].filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative group"
    >
      <Link to={`/guia/${article.slug}`} className="block h-full">
        <div
          className="wine-card rounded-2xl wine-hover cursor-pointer h-full flex flex-col overflow-hidden transition-transform duration-300 group-hover:-translate-y-2"
        >
          {article.image_url && (
            <div className="h-56 overflow-hidden">
              <img src={article.image_url} alt={article.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            </div>
          )}
          <div className="p-8 flex-grow flex flex-col">
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.map(tag => (
                  <button
                    key={tag}
                    onClick={(e) => handleTagClick(e, tag)}
                    className="text-xs bg-amber-400/20 text-amber-200 px-2 py-1 rounded-full hover:bg-amber-400/40 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
            <h3 className="font-playfair text-2xl font-semibold text-amber-200 mb-4 flex-grow">
              {article.title}
            </h3>
            <p className="text-amber-100/80 leading-relaxed mb-6 line-clamp-3">
              {createSnippet(article.content)}
            </p>
            <div className="mt-auto border-t border-amber-200/10 pt-4 text-xs text-amber-100/60">
               Publicado el {formattedDate}
            </div>
          </div>
        </div>
      </Link>
      {isAdmin && (
        <div className="absolute top-4 right-4 flex items-center gap-2" onClick={handleAdminActionClick}>
           <Button asChild variant="ghost" size="icon" className="h-9 w-9 bg-black/30 hover:bg-black/60">
              <Link to={`/guia/editar/${article.slug}`}>
                <Pencil className="h-4 w-4 text-amber-200" />
              </Link>
           </Button>
           <DeleteArticleDialog 
              articleId={article.id} 
              articleTitle={article.title}
              onDeleted={() => onArticleDeleted(article.id)}
            />
        </div>
      )}
    </motion.div>
  );
};


const ArticleList = ({ articles, isAdmin, onArticleDeleted, onTagClick }) => {
  if (articles.length === 0) {
    return (
      <div className="text-center py-16">
        <BookOpen className="h-16 w-16 mx-auto text-amber-400/50 mb-4" />
        <h3 className="font-playfair text-2xl text-amber-200">No hay artículos para este filtro</h3>
        <p className="text-amber-100/70 mt-2">Prueba a seleccionar otra categoría o a ver todos los artículos.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {articles.map((article, index) => (
        <ArticleCard 
          key={article.id} 
          article={article} 
          index={index} 
          isAdmin={isAdmin}
          onArticleDeleted={onArticleDeleted}
          onTagClick={onTagClick}
        />
      ))}
    </div>
  );
};

export default ArticleList;
