import { useEffect, useState } from "react";
import './CategoryFilter.css'
import { fetchBookCategories } from "../api/BooksAPI";

// This component renders a category filter with checkboxes for each category.
// It fetches the list of categories from an API and allows users to select/deselect categories.

function CategoryFilter ({
    selectedCategories, setSelectedCategories,
}: {
    selectedCategories: string[];
    setSelectedCategories: (categories: string[]) => void;
}) {
    const [categories, setCategories] = useState<string[]>([]);

    // Fetches the list of book categories from the API when the component mounts.
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchBookCategories();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        loadCategories();
    }, []);

    // Handles the checkbox change event to update the selected categories.
    function handleCheckboxChange({target}: {target: HTMLInputElement}) {
        const updatedCategories = selectedCategories.includes(target.value)
            ? selectedCategories.filter(x => x !== target.value)
            : [...selectedCategories, target.value];

        setSelectedCategories(updatedCategories);
    } 

    return (
        <div className="category-filter">
            <br/>
            <h5>Book Categories</h5>
            <br/>
            <div className="category-list">
                {categories.map((b) => (
                    <div key={b} className="category-item">
                        {/* Renders a checkbox for each category */}
                        <input 
                            type='checkbox' 
                            id={b} 
                            value={b} 
                            className="category-checkbox" 
                            onChange={handleCheckboxChange}
                            checked={selectedCategories.includes(b)}
                        />
                        <label htmlFor={b}>{b}</label> {/* Displays the category name */}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CategoryFilter;