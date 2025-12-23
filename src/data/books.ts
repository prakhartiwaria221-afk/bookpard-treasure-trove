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
  "New Books",
  "Old Books",
];
