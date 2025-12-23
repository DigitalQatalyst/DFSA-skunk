import React, { useState } from 'react';
import { Product } from '../../../data/dfsa/types';

export interface ProductTagsProps {
    products: Product[];
    maxVisible?: number;
    onProductClick?: (product: Product) => void;
    size?: 'sm' | 'md';
}

/**
 * ProductTags Component
 * Displays products as tags/chips with overflow handling
 */
export const ProductTags: React.FC<ProductTagsProps> = ({
    products,
    maxVisible = 4,
    onProductClick,
    size = 'md',
}) => {
    const [showAll, setShowAll] = useState(false);

    if (!products || products.length === 0) {
        return null;
    }

    const visibleProducts = showAll ? products : products.slice(0, maxVisible);
    const hiddenCount = products.length - maxVisible;
    const hasMore = hiddenCount > 0;

    const sizeClasses = size === 'sm'
        ? 'px-2 py-0.5 text-xs'
        : 'px-2.5 py-1 text-xs';

    const handleTagClick = (product: Product, e: React.MouseEvent) => {
        e.stopPropagation();
        if (onProductClick) {
            onProductClick(product);
        }
    };

    const handleShowMore = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowAll(!showAll);
    };

    return (
        <div className="flex flex-wrap gap-1.5">
            {visibleProducts.map((product, index) => (
                <span
                    key={product.code || index}
                    onClick={(e) => handleTagClick(product, e)}
                    className={`
            inline-flex items-center rounded-full font-medium
            bg-gray-100 text-gray-700 hover:bg-gray-200
            transition-colors cursor-default
            ${sizeClasses}
            ${onProductClick ? 'cursor-pointer' : ''}
          `}
                    title={product.description || product.name}
                >
                    {product.name}
                </span>
            ))}

            {hasMore && !showAll && (
                <button
                    onClick={handleShowMore}
                    className={`
            inline-flex items-center rounded-full font-medium
            bg-dfsa-gold-100 text-dfsa-gold-700 
            hover:bg-dfsa-gold-200
            transition-colors cursor-pointer
            ${sizeClasses}
          `}
                    title="Show all products"
                >
                    +{hiddenCount} more
                </button>
            )}

            {showAll && hasMore && (
                <button
                    onClick={handleShowMore}
                    className={`
            inline-flex items-center rounded-full font-medium
            bg-gray-100 text-gray-600 
            hover:bg-gray-200
            transition-colors cursor-pointer
            ${sizeClasses}
          `}
                >
                    Show less
                </button>
            )}
        </div>
    );
};
