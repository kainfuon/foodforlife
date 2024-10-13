import './Home.css'
import Header from './../../components/Header/Header';
import { useState } from 'react';
import ExploreMenu from './../../components/ExploreMenu/ExploreMenu';

const Home = () => {
    const [category, setCategory] = useState("All")
    return (
        <div>
            <Header />
            <ExploreMenu category={category} setCategory={setCategory} />
        </div>
    )
}

export default Home