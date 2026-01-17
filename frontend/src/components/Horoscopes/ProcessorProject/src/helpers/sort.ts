import { IForumCategory } from '../models/interfaces/forum';

export const categorySort = (categories: IForumCategory[]): Array<any> => {
  return categories
    .filter(item => !item.parent)
    .map(item => {
      const children = categories.filter(category => category.parent === item.id);
      return {
        ...item,
        children
      };
    });
};

export const sortCategories = (categories: any) => {
  const sortedCategories: any = [];

  // Iterate over each category
  categories.forEach((category: any) => {
    // Check if the category has a parent
    if (category.parent) {
      // Find the parent category
      const parentCategory = categories.find(
        (c: any) => c.id === category.parent
      );

      // If the parent category is found, add the child and parent objects to the sorted array
      if (parentCategory) {
        sortedCategories.push({
          child: category,
          parent: parentCategory
        });
      } else {
        // If the parent category is not found, add null objects to the sorted array
        sortedCategories.push({
          child: category,
          parent: null
        });
      }
    } else {
      // If the category has no parent, add null objects to the sorted array
      sortedCategories.push({
        child: category,
        parent: null
      });
    }
  });

  return sortedCategories;
};
