import type { Schema, Attribute } from '@strapi/strapi';

export interface ElementsCard extends Schema.Component {
  collectionName: 'components_elements_cards';
  info: {
    displayName: 'Card';
  };
  attributes: {
    title: Attribute.String;
    api: Attribute.String;
  };
}

export interface ElementsCategoryCard extends Schema.Component {
  collectionName: 'components_elements_category_cards';
  info: {
    displayName: 'CategoryCard';
  };
  attributes: {
    categorytitle: Attribute.String;
    CategoryItem: Attribute.Component<'elements.card', true>;
  };
}

export interface ElementsProductview extends Schema.Component {
  collectionName: 'components_elements_productviews';
  info: {
    displayName: 'Productview';
  };
  attributes: {
    items: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'elements.card': ElementsCard;
      'elements.category-card': ElementsCategoryCard;
      'elements.productview': ElementsProductview;
    }
  }
}
