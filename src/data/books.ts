import { Book } from "@/types/book";

import harryPotterImg from "@/assets/books/harry-potter-stone.png";
import harryPotterChamberImg from "@/assets/books/harry-potter.png";
import toyStoryImg from "@/assets/books/toy-story.jpg";
import carsImg from "@/assets/books/cars.jpg";
import mysteryImg from "@/assets/books/mystery.jpg";
import romanceImg from "@/assets/books/romance.jpg";
import fictionImg from "@/assets/books/fiction.jpg";
import studyImg from "@/assets/books/study.jpg";
import horrorImg from "@/assets/books/horror.jpg";

export const booksData: Book[] = [
  {
    id: "1",
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    category: "Kids",
    price: 399,
    oldPrice: 599,
    image: harryPotterImg,
    condition: "new",
    description: "The magical journey begins at Hogwarts School of Witchcraft and Wizardry.",
    sourceUrl: "https://www.amazon.in/Harry-Potter-Philosophers-Stone-Rowling/dp/1408855658",
  },
  {
    id: "2",
    title: "Toy Story Adventures",
    author: "Disney Pixar",
    category: "Kids",
    price: 249,
    oldPrice: 349,
    image: toyStoryImg,
    condition: "new",
    description: "Join Woody and Buzz on their exciting adventures!",
    sourceUrl: "https://www.amazon.in/Toy-Story-Adventures-Disney-Pixar/dp/1506717616",
  },
  {
    id: "3",
    title: "Cars: Lightning McQueen's Story",
    author: "Disney Pixar",
    category: "Kids",
    price: 299,
    oldPrice: 449,
    image: carsImg,
    condition: "new",
    description: "Race through Radiator Springs with Lightning McQueen.",
    sourceUrl: "https://www.amazon.in/Cars-Lightning-McQueens-Disney-Pixar/dp/0736423451",
  },
  {
    id: "4",
    title: "Mystery Thriller",
    author: "Agatha Christie",
    category: "Mystery",
    price: 499,
    oldPrice: 699,
    image: mysteryImg,
    condition: "new",
    description: "An intriguing mystery that will keep you guessing until the end.",
    sourceUrl: "https://www.amazon.in/Agatha-Christie/e/B000AQ0842",
  },
  {
    id: "5",
    title: "The Romance Collection",
    author: "Nicholas Sparks",
    category: "Romance",
    price: 449,
    oldPrice: 599,
    image: romanceImg,
    condition: "new",
    description: "A heartwarming tale of love and passion.",
    sourceUrl: "https://www.amazon.in/Nicholas-Sparks/e/B000AQ3TBI",
  },
  {
    id: "6",
    title: "Literary Fiction Bestseller",
    author: "Margaret Atwood",
    category: "Fiction",
    price: 549,
    oldPrice: 749,
    image: fictionImg,
    condition: "new",
    description: "Award-winning contemporary fiction.",
    sourceUrl: "https://www.amazon.in/Margaret-Atwood/e/B000AQ1JK0",
  },
  {
    id: "7",
    title: "Advanced Mathematics",
    author: "Robert Smith",
    category: "Study",
    price: 799,
    oldPrice: 999,
    image: studyImg,
    condition: "new",
    description: "Comprehensive guide for students and professionals.",
    sourceUrl: "https://www.amazon.in/s?k=advanced+mathematics+textbook",
  },
  {
    id: "8",
    title: "The Haunted House",
    author: "Stephen King",
    category: "Horror",
    price: 499,
    oldPrice: 649,
    image: horrorImg,
    condition: "new",
    description: "A spine-chilling horror story that will haunt your dreams.",
    sourceUrl: "https://www.amazon.in/Stephen-King/e/B000AQ0842",
  },
  {
    id: "9",
    title: "Harry Potter Chamber of Secrets",
    author: "J.K. Rowling",
    category: "Kids",
    price: 299,
    oldPrice: 599,
    image: harryPotterChamberImg,
    condition: "old",
    description: "Used book in excellent condition.",
    sourceUrl: "https://www.amazon.in/Harry-Potter-Chamber-Secrets-Rowling/dp/1408855666",
  },
  {
    id: "10",
    title: "Murder on the Orient Express",
    author: "Agatha Christie",
    category: "Mystery",
    price: 349,
    oldPrice: 699,
    image: mysteryImg,
    condition: "old",
    description: "Classic mystery in good condition.",
    sourceUrl: "https://www.amazon.in/Murder-Orient-Express-Agatha-Christie/dp/0007119313",
  },
];

export const categories = [
  "All Books",
  "Kids",
  "Fiction",
  "Mystery",
  "Romance",
  "Horror",
  "Study",
  "Historical",
  "Politics",
  "Spirituality",
  "Novels & Manga",
  "Health",
  "Poetry",
  "Collection",
];

// Define book collections (series/author groupings)
export const bookCollections = [
  {
    id: "harry-potter",
    name: "Harry Potter Series",
    author: "J.K. Rowling",
    keywords: ["harry potter"],
  },
  {
    id: "disney-pixar",
    name: "Disney Pixar Collection",
    author: "Disney Pixar",
    keywords: ["toy story", "cars", "disney", "pixar"],
  },
  {
    id: "agatha-christie",
    name: "Agatha Christie Mysteries",
    author: "Agatha Christie",
    keywords: ["agatha christie", "orient express", "poirot", "marple"],
  },
  {
    id: "stephen-king",
    name: "Stephen King Horror",
    author: "Stephen King",
    keywords: ["stephen king"],
  },
];
