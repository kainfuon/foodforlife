import PropTypes from 'prop-types';
import { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import FoodItem from '../FoodItem/FoodItem';
import './FoodDisplay.css';

const FoodDisplay = ({ category }) => {
    const { food_list } = useContext(StoreContext);

    console.log("food_list:", food_list);
    console.log("Selected category:", category);

    return (
        <div className='food-display' id='food-display'>
            <h2>Top dishes near you</h2>
            <div className="food-display-list">
                {food_list.map((item, index) => {
                    if (category === "All" || category === item.category) {
                        return <FoodItem key={index} id={item._id} name={item.name} description={item.description} price={item.price} calo={item.calo} image={item.image} />
                    }
                })}
            </div>
        </div>
    )
}

FoodDisplay.propTypes = {
    category: PropTypes.string.isRequired,
};

export default FoodDisplay;
