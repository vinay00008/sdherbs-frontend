import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, image, url }) => {
    const siteTitle = "SD Herbs | Nature's Healing Touch";
    const defaultDescription = "Premium herbal products rooted in Ayurveda. 100% organic, certified, and ethically sourced for your holistic wellness.";
    const defaultKeywords = "herbal products, ayurveda, organic herbs, wellness, natural remedies, sd herbs";
    const defaultImage = "https://sdherbs.com/og-image.jpg"; // Replace with actual default OG image
    const siteUrl = "https://sdherbs.com"; // Replace with actual domain

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{title ? `${title} | SD Herbs` : siteTitle}</title>
            <meta name="description" content={description || defaultDescription} />
            <meta name="keywords" content={keywords || defaultKeywords} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url || siteUrl} />
            <meta property="og:title" content={title ? `${title} | SD Herbs` : siteTitle} />
            <meta property="og:description" content={description || defaultDescription} />
            <meta property="og:image" content={image || defaultImage} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url || siteUrl} />
            <meta property="twitter:title" content={title ? `${title} | SD Herbs` : siteTitle} />
            <meta property="twitter:description" content={description || defaultDescription} />
            <meta property="twitter:image" content={image || defaultImage} />
        </Helmet>
    );
};

export default SEO;
