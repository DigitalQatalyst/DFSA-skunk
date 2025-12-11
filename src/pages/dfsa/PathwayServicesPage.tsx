import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { MarketplacePage } from '../../components/marketplace/MarketplacePage';
import {
  getPathwayByRegimeAndId,
  formatPageTitle,
} from '../../utils/pathwayHelpers';

/**
 * Pathway Services Page
 * Displays non-financial services in the context of a selected DFSA pathway
 * URL format: /{regime}/{pathwayId}
 *
 * Note: This component simply validates the pathway and passes through to MarketplacePage.
 * MarketplacePage handles the full page layout including Header, breadcrumbs, and Footer.
 */
const PathwayServicesPage: React.FC = () => {
  const { regime, pathwayId } = useParams<{
    regime: string;
    pathwayId: string;
  }>();

  // Validate pathway exists
  const pathway = getPathwayByRegimeAndId(regime!, pathwayId!);

  // Redirect to regime page if pathway not found
  if (!pathway) {
    return <Navigate to={`/${regime}`} replace />;
  }

  const pageTitle = formatPageTitle(regime!, pathway.code);

  // MarketplacePage handles the complete page layout
  return (
    <MarketplacePage
      marketplaceType="non-financial"
      title={pageTitle}
      description={pathway.description}
    />
  );
};

export default PathwayServicesPage;
