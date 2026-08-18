import React from 'react';
import { BookOpen, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import DeleteArticleDialog from '@/components/noticias/DeleteArticleDialog';
import Reveal from '@/components/copa/Reveal';
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
    <Reveal delay={Math.min(index * 0.06, 0.24)} className="relative group">
      <Link to={`/noticias/${article.slug}`} className="block h-full">
        <div className="copa-card h-full flex flex-col overflow-hidden transition-transform duration-300 group-hover:-translate-y-1.5">
          {article.image_url && (
            <div className="h-56 overflow-hidden">
              <img src={article.image_url} alt={article.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            </div>
          )}
          <div className="p-6 flex-grow flex flex-col">
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.map(tag => (
                  <button
                    key={tag}
                    onClick={(e) => handleTagClick(e, tag)}
                    className="font-jost text-[10px] tracking-[0.1em] uppercase border border-copa-gold text-copa-ink/70 px-2.5 py-1 hover:border-copa-burgundy hover:text-copa-burgundy transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
            <h3 className="font-cormorant flex-grow" style={{ fontSize: 24 }}>
              {article.title}
            </h3>
            <p className="text-copa-ink/70 leading-relaxed mt-3 mb-4 line-clamp-3" style={{ fontSize: 15 }}>
              {createSnippet(article.content)}
            </p>
            <div className="mt-auto border-t border-copa-gold/30 pt-4 font-jost text-[10px] tracking-[0.1em] uppercase text-copa-ink/50">
              Publicado el {formattedDate}
            </div>
          </div>
        </div>
      </Link>
      {isAdmin && (
        <div className="absolute top-4 right-4 flex items-center gap-2" onClick={handleAdminActionClick}>
           <Link to={`/noticias/editar/${article.slug}`} className="h-9 w-9 flex items-center justify-center bg-copa-ink/40 hover:bg-copa-ink/70 text-copa-cream transition-colors" aria-label="Editar artículo">
              <Pencil className="h-4 w-4" />
           </Link>
           <DeleteArticleDialog
              articleId={article.id}
              articleTitle={article.title}
              onDeleted={() => onArticleDeleted(article.id)}
            />
        </div>
      )}
    </Reveal>
  );
};


const ArticleList = ({ articles, isAdmin, onArticleDeleted, onTagClick }) => {
  if (articles.length === 0) {
    return (
      <div className="text-center py-16">
        <BookOpen className="h-14 w-14 mx-auto text-copa-gold/60 mb-4" />
        <h3 className="font-cormorant" style={{ fontSize: 26 }}>No hay artículos para este filtro</h3>
        <p className="text-copa-ink/60 mt-2">Prueba a seleccionar otra categoría o a ver todos los artículos.</p>
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
