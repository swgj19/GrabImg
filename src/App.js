import React, { useState, useEffect } from 'react';
// import { FaSearch } from 'react-icons/fa';
import { HiSearch } from 'react-icons/hi';
import { BiLoader } from 'react-icons/bi';
import Photo from './Photo';
// const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`
const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`;
const mainUrl = `https://api.unsplash.com/photos/`;
const searchUrl = `https://api.unsplash.com/search/photos/`;

function App() {
	const [loading, setLoading] = useState(false);
	const [photos, setPhotos] = useState([]);
	const [page, setPage] = useState(1);
	const [query, setQuery] = useState('');

	const fetchImages = async () => {
		setLoading(true);
		let url;

		const urlPage = `&page=${page}`;
		const urlQuery = `&query=${query}`;

		if (query) {
			url = `${searchUrl}${clientID}${urlPage}${urlQuery}`;
		} else {
			url = `${mainUrl}${clientID}${urlPage}`;
		}

		try {
			const response = await fetch(url);
			const data = await response.json();
			setPhotos((oldPhotos) => {
				if (query && page === 1) {
					return data.results;
				} else if (query) {
					return [...oldPhotos, ...data.results];
				} else return [...oldPhotos, ...data];
			});
			setLoading(false);
		} catch (error) {
			setLoading(false);
			console.log(error);
		}
	};

	useEffect(() => {
		fetchImages();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page]);

	useEffect(() => {
		const event = window.addEventListener('scroll', () => {
			if (
				!loading &&
				window.innerHeight + window.scrollY >= document.body.scrollHeight - 2
			) {
				setPage((oldPage) => {
					return oldPage + 1;
				});
			}
		});
		return () => window.removeEventListener('scroll', event);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();
		setPage(1);
		fetchImages();
	};

	return (
		<main>
			<section className='title'>
				<h2>GrabImg</h2>
			</section>
			<section className='search'>
				<form className='search-form'>
					<input
						type='text'
						placeholder='search'
						className='form-input'
						value={query}
						onChange={(e) => setQuery(e.target.value)}
					/>
					<button type='submit' className='submit-btn' onClick={handleSubmit}>
						<HiSearch style={{ color: '#fffff0' }} />
					</button>
				</form>
			</section>
			<section className='photos'>
				<div className='photos-center'>
					{photos.map((image, index) => {
						console.log(image);
						return <Photo key={image.id} {...image} />;
					})}
				</div>
				{loading && (
					<h2 className='loading'>
						<BiLoader style={{ color: '#fffff0' }} />
					</h2>
				)}
			</section>
		</main>
	);
}

export default App;
