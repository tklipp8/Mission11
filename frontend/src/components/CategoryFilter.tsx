import { useEffect, useState } from "react";
import './CategoryFilter.css'

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
        const fetchCategories = async () =>{
            try {
                const response = await fetch(
                    'https://localhost:5000/Book/GetBookCategories'
                );
                const data = await response.json();
                console.log('Fetched categories:', data); // Logs the fetched categories for debugging.
                setCategories(data);                
            } catch (error) {
                console.error('Error fetching categories', error) // Logs any errors that occur during the fetch.
            }
        };

        fetchCategories();
    }, []);

    // Handles the checkbox change event to update the selected categories.
    function handleCheckboxChange ({target}: {target: HTMLInputElement}) {
        const updatedCategories = selectedCategories.includes(target.value)
        ? selectedCategories.filter(x => x !== target.value) // Removes the category if it is already selected.
        : [...selectedCategories, target.value] // Adds the category if it is not already selected.

        setSelectedCategories(updatedCategories); // Updates the state with the new list of selected categories.
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
                        <input type='checkbox' id={b} value={b} className="category-checkbox" onChange={handleCheckboxChange} />
                        <label htmlFor={b}>{b}</label> {/* Displays the category name */}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CategoryFilter;