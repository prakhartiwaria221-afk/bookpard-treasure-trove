import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Printer, Download, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProjectDocumentation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "BookPard - Project Documentation";
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 print:bg-white">
      {/* Print Controls - Hidden when printing */}
      <div className="print:hidden fixed top-4 right-4 z-50 flex gap-2">
        <Button variant="outline" onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" />
          Print / Save PDF
        </Button>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-12 print:px-0 print:py-0">
        {/* Title Page */}
        <div className="text-center mb-16 print:mb-8 page-break-after">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">BookPard</h1>
          <h2 className="text-2xl text-gray-600 mb-8">Online Book Marketplace</h2>
          <div className="text-lg text-gray-500 mb-12">Project Documentation Report</div>
          
          <div className="border-t border-b border-gray-300 py-8 my-8">
            <p className="text-gray-600 mb-2"><strong>Project Type:</strong> Full-Stack Web Application</p>
            <p className="text-gray-600 mb-2"><strong>Technology:</strong> React + TypeScript + Supabase</p>
            <p className="text-gray-600"><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="mb-12 print:mb-8">
          <h2 className="text-2xl font-bold mb-4 border-b-2 border-gray-900 pb-2">Table of Contents</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Project Overview</li>
            <li>Technology Stack</li>
            <li>System Architecture</li>
            <li>Module Structure</li>
            <li>Database Schema</li>
            <li>Class Diagram</li>
            <li>Application Flow</li>
            <li>Security Architecture</li>
            <li>Features & Functionality</li>
            <li>Dependencies</li>
            <li>Deployment</li>
          </ol>
        </div>

        {/* 1. Project Overview */}
        <section className="mb-12 print:mb-8">
          <h2 className="text-2xl font-bold mb-4 border-b-2 border-gray-900 pb-2">1. Project Overview</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            <strong>BookPard</strong> is a comprehensive online book marketplace that enables users to buy and sell 
            both new and used books. The platform features a modern, responsive design with dark/light theme support, 
            advanced search and filtering capabilities, secure user authentication, and a robust admin management system.
          </p>
          
          <h3 className="text-xl font-semibold mb-3 mt-6">1.1 Objectives</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Provide a user-friendly platform for buying and selling books</li>
            <li>Implement secure authentication and authorization</li>
            <li>Enable category-based browsing and advanced search</li>
            <li>Support multiple payment methods</li>
            <li>Provide admin tools for content management</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">1.2 Scope</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>User registration and authentication</li>
            <li>Book catalog with search and filter</li>
            <li>Shopping cart and checkout process</li>
            <li>Order management and tracking</li>
            <li>User book listings (sell feature)</li>
            <li>Admin dashboard for management</li>
          </ul>
        </section>

        {/* 2. Technology Stack */}
        <section className="mb-12 print:mb-8">
          <h2 className="text-2xl font-bold mb-4 border-b-2 border-gray-900 pb-2">2. Technology Stack</h2>
          
          <h3 className="text-xl font-semibold mb-3 mt-6">2.1 Frontend Technologies</h3>
          <table className="w-full border-collapse border border-gray-300 mb-6">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Technology</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Version</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">React</td>
                <td className="border border-gray-300 px-4 py-2">18.3.1</td>
                <td className="border border-gray-300 px-4 py-2">UI Library</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">TypeScript</td>
                <td className="border border-gray-300 px-4 py-2">Latest</td>
                <td className="border border-gray-300 px-4 py-2">Type-safe JavaScript</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Vite</td>
                <td className="border border-gray-300 px-4 py-2">Latest</td>
                <td className="border border-gray-300 px-4 py-2">Build Tool & Dev Server</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">Tailwind CSS</td>
                <td className="border border-gray-300 px-4 py-2">Latest</td>
                <td className="border border-gray-300 px-4 py-2">Utility-first CSS Framework</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">shadcn/ui</td>
                <td className="border border-gray-300 px-4 py-2">Latest</td>
                <td className="border border-gray-300 px-4 py-2">UI Component Library</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">React Router DOM</td>
                <td className="border border-gray-300 px-4 py-2">6.30.1</td>
                <td className="border border-gray-300 px-4 py-2">Client-side Routing</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">TanStack Query</td>
                <td className="border border-gray-300 px-4 py-2">5.83.0</td>
                <td className="border border-gray-300 px-4 py-2">Server State Management</td>
              </tr>
            </tbody>
          </table>

          <h3 className="text-xl font-semibold mb-3 mt-6">2.2 Backend Technologies</h3>
          <table className="w-full border-collapse border border-gray-300 mb-6">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Technology</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Supabase (PostgreSQL)</td>
                <td className="border border-gray-300 px-4 py-2">Database & Backend-as-a-Service</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">Supabase Auth</td>
                <td className="border border-gray-300 px-4 py-2">Authentication & Authorization</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Supabase Storage</td>
                <td className="border border-gray-300 px-4 py-2">File/Image Storage</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">Edge Functions (Deno)</td>
                <td className="border border-gray-300 px-4 py-2">Serverless Backend Logic</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Row Level Security (RLS)</td>
                <td className="border border-gray-300 px-4 py-2">Database Security Policies</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* 3. System Architecture */}
        <section className="mb-12 print:mb-8">
          <h2 className="text-2xl font-bold mb-4 border-b-2 border-gray-900 pb-2">3. System Architecture</h2>
          
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-300 mb-6">
            <pre className="text-sm font-mono whitespace-pre-wrap">
{`┌─────────────────────────────────────────────────────────────┐
│                      CLIENT (Browser)                        │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                 React Application                        │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │ │
│  │  │  Pages   │  │Components│  │  Hooks   │  │ Contexts │ │ │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   SUPABASE BACKEND                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │    Auth      │  │   Database   │  │   Storage    │       │
│  │  (JWT-based) │  │ (PostgreSQL) │  │   (Files)    │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│  ┌──────────────┐  ┌──────────────┐                         │
│  │ Edge         │  │     RLS      │                         │
│  │ Functions    │  │   Policies   │                         │
│  └──────────────┘  └──────────────┘                         │
└─────────────────────────────────────────────────────────────┘`}
            </pre>
          </div>

          <h3 className="text-xl font-semibold mb-3 mt-6">3.1 Architecture Pattern</h3>
          <p className="text-gray-700 mb-4">
            The application follows a <strong>Client-Server Architecture</strong> with a 
            <strong> Component-Based Frontend</strong> pattern. The frontend uses React with 
            a unidirectional data flow, while the backend leverages Supabase for 
            database operations, authentication, and file storage.
          </p>
        </section>

        {/* 4. Module Structure */}
        <section className="mb-12 print:mb-8">
          <h2 className="text-2xl font-bold mb-4 border-b-2 border-gray-900 pb-2">4. Module Structure</h2>
          
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-300 mb-6">
            <pre className="text-sm font-mono whitespace-pre-wrap">
{`src/
├── components/           # Reusable UI Components
│   ├── ui/              # Base UI components (Button, Card, etc.)
│   ├── Navbar.tsx       # Navigation bar
│   ├── Hero.tsx         # Homepage hero section
│   ├── BookCard.tsx     # Book display card
│   ├── BookSection.tsx  # Book list section
│   ├── CategoryFilter.tsx
│   ├── FilterControls.tsx
│   ├── SearchSuggestions.tsx
│   └── ThemeToggle.tsx
│
├── pages/               # Page Components (Routes)
│   ├── Index.tsx        # Homepage
│   ├── Auth.tsx         # Login/Signup
│   ├── Cart.tsx         # Shopping cart
│   ├── Checkout.tsx     # Checkout process
│   ├── Orders.tsx       # Order history
│   ├── SellBooks.tsx    # User book listings
│   ├── AdminDashboard.tsx
│   ├── ManageBooks.tsx
│   └── Settings.tsx
│
├── hooks/               # Custom React Hooks
│   ├── useCart.ts       # Cart management
│   ├── useAdmin.ts      # Admin role check
│   └── useTheme.ts      # Theme management
│
├── contexts/            # React Contexts
│   ├── ThemeContext.tsx # Dark/Light theme
│   └── FireworksContext.tsx
│
├── data/                # Static Data
│   └── books.ts         # Book data & categories
│
├── types/               # TypeScript Types
│   └── book.ts          # Book interface
│
├── integrations/        # External Integrations
│   └── supabase/        # Supabase client
│
└── lib/                 # Utility Functions
    └── utils.ts`}
            </pre>
          </div>

          <h3 className="text-xl font-semibold mb-3 mt-6">4.1 Module Descriptions</h3>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Module</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-semibold">components/</td>
                <td className="border border-gray-300 px-4 py-2">Reusable UI components following atomic design</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 font-semibold">pages/</td>
                <td className="border border-gray-300 px-4 py-2">Route-level components representing full pages</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-semibold">hooks/</td>
                <td className="border border-gray-300 px-4 py-2">Custom hooks for reusable stateful logic</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 font-semibold">contexts/</td>
                <td className="border border-gray-300 px-4 py-2">Global state management using React Context</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-semibold">integrations/</td>
                <td className="border border-gray-300 px-4 py-2">Third-party service integrations (Supabase)</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* 5. Database Schema */}
        <section className="mb-12 print:mb-8 page-break-before">
          <h2 className="text-2xl font-bold mb-4 border-b-2 border-gray-900 pb-2">5. Database Schema (ER Diagram)</h2>
          
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-300 mb-6">
            <pre className="text-sm font-mono whitespace-pre-wrap">
{`┌─────────────────────────────────────────────────────────────────────────┐
│                           ENTITY RELATIONSHIP DIAGRAM                     │
└─────────────────────────────────────────────────────────────────────────┘

    ┌────────────────┐         ┌────────────────┐         ┌────────────────┐
    │   AUTH.USERS   │         │     BOOKS      │         │  USER_ROLES    │
    │  (Supabase)    │         │                │         │                │
    ├────────────────┤         ├────────────────┤         ├────────────────┤
    │ PK  id (uuid)  │◄───┐    │ PK  id (uuid)  │         │ PK  id (uuid)  │
    │     email      │    │    │     title      │         │ FK  user_id    │◄─┐
    │     created_at │    │    │     author     │         │     role       │  │
    └────────────────┘    │    │     category   │         │     created_at │  │
           │              │    │     price      │         └────────────────┘  │
           │              │    │     old_price  │                              │
           │              └────│ FK  created_by │         ┌────────────────┐  │
           │                   │     image_url  │         │     ORDERS     │  │
           │                   │     condition  │         ├────────────────┤  │
           │                   │     description│         │ PK  id (uuid)  │  │
           │                   │     created_at │         │ FK  user_id    │◄─┤
           │                   └────────────────┘         │     items      │  │
           │                                              │     total_price│  │
           │                   ┌────────────────┐         │     status     │  │
           │                   │ USER_LISTINGS  │         │     payment_   │  │
           │                   ├────────────────┤         │       method   │  │
           │                   │ PK  id (uuid)  │         │     delivery_  │  │
           └──────────────────►│ FK  user_id    │         │       address  │  │
                               │     title      │         │     created_at │  │
                               │     author     │         └────────────────┘  │
                               │     category   │                              │
                               │     price      │                              │
                               │     condition  │                              │
                               │     image_url  │                              │
                               │     contact_   │                              │
                               │       email    │                              │
                               │     contact_   │                              │
                               │       phone    │                              │
                               │     status     │                              │
                               │     created_at │                              │
                               └────────────────┘                              │
                                                                               │
                    Relationships: ────────────────────────────────────────────┘
                    • AUTH.USERS 1:N BOOKS (created_by)
                    • AUTH.USERS 1:N USER_LISTINGS (user_id)
                    • AUTH.USERS 1:N ORDERS (user_id)
                    • AUTH.USERS 1:N USER_ROLES (user_id)`}
            </pre>
          </div>

          <h3 className="text-xl font-semibold mb-3 mt-6">5.1 Table Definitions</h3>
          
          <h4 className="text-lg font-semibold mb-2 mt-4">books</h4>
          <table className="w-full border-collapse border border-gray-300 mb-4 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2 text-left">Column</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Type</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Constraints</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border border-gray-300 px-3 py-1">id</td><td className="border border-gray-300 px-3 py-1">uuid</td><td className="border border-gray-300 px-3 py-1">PRIMARY KEY</td></tr>
              <tr className="bg-gray-50"><td className="border border-gray-300 px-3 py-1">title</td><td className="border border-gray-300 px-3 py-1">text</td><td className="border border-gray-300 px-3 py-1">NOT NULL</td></tr>
              <tr><td className="border border-gray-300 px-3 py-1">author</td><td className="border border-gray-300 px-3 py-1">text</td><td className="border border-gray-300 px-3 py-1">NOT NULL</td></tr>
              <tr className="bg-gray-50"><td className="border border-gray-300 px-3 py-1">category</td><td className="border border-gray-300 px-3 py-1">text</td><td className="border border-gray-300 px-3 py-1">NOT NULL</td></tr>
              <tr><td className="border border-gray-300 px-3 py-1">price</td><td className="border border-gray-300 px-3 py-1">integer</td><td className="border border-gray-300 px-3 py-1">NOT NULL</td></tr>
              <tr className="bg-gray-50"><td className="border border-gray-300 px-3 py-1">old_price</td><td className="border border-gray-300 px-3 py-1">integer</td><td className="border border-gray-300 px-3 py-1">NOT NULL</td></tr>
              <tr><td className="border border-gray-300 px-3 py-1">image_url</td><td className="border border-gray-300 px-3 py-1">text</td><td className="border border-gray-300 px-3 py-1">NOT NULL</td></tr>
              <tr className="bg-gray-50"><td className="border border-gray-300 px-3 py-1">condition</td><td className="border border-gray-300 px-3 py-1">text</td><td className="border border-gray-300 px-3 py-1">NOT NULL</td></tr>
              <tr><td className="border border-gray-300 px-3 py-1">description</td><td className="border border-gray-300 px-3 py-1">text</td><td className="border border-gray-300 px-3 py-1">NULLABLE</td></tr>
              <tr className="bg-gray-50"><td className="border border-gray-300 px-3 py-1">created_by</td><td className="border border-gray-300 px-3 py-1">uuid</td><td className="border border-gray-300 px-3 py-1">FK → auth.users</td></tr>
            </tbody>
          </table>

          <h4 className="text-lg font-semibold mb-2 mt-4">orders</h4>
          <table className="w-full border-collapse border border-gray-300 mb-4 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2 text-left">Column</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Type</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Constraints</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border border-gray-300 px-3 py-1">id</td><td className="border border-gray-300 px-3 py-1">uuid</td><td className="border border-gray-300 px-3 py-1">PRIMARY KEY</td></tr>
              <tr className="bg-gray-50"><td className="border border-gray-300 px-3 py-1">user_id</td><td className="border border-gray-300 px-3 py-1">uuid</td><td className="border border-gray-300 px-3 py-1">FK → auth.users</td></tr>
              <tr><td className="border border-gray-300 px-3 py-1">items</td><td className="border border-gray-300 px-3 py-1">jsonb</td><td className="border border-gray-300 px-3 py-1">NOT NULL</td></tr>
              <tr className="bg-gray-50"><td className="border border-gray-300 px-3 py-1">total_price</td><td className="border border-gray-300 px-3 py-1">integer</td><td className="border border-gray-300 px-3 py-1">NOT NULL</td></tr>
              <tr><td className="border border-gray-300 px-3 py-1">status</td><td className="border border-gray-300 px-3 py-1">text</td><td className="border border-gray-300 px-3 py-1">DEFAULT 'pending'</td></tr>
              <tr className="bg-gray-50"><td className="border border-gray-300 px-3 py-1">payment_method</td><td className="border border-gray-300 px-3 py-1">text</td><td className="border border-gray-300 px-3 py-1">NOT NULL</td></tr>
              <tr><td className="border border-gray-300 px-3 py-1">delivery_address</td><td className="border border-gray-300 px-3 py-1">text</td><td className="border border-gray-300 px-3 py-1">NULLABLE</td></tr>
            </tbody>
          </table>
        </section>

        {/* 6. Class Diagram */}
        <section className="mb-12 print:mb-8">
          <h2 className="text-2xl font-bold mb-4 border-b-2 border-gray-900 pb-2">6. Class Diagram</h2>
          
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-300 mb-6">
            <pre className="text-sm font-mono whitespace-pre-wrap">
{`┌─────────────────────────────────────────────────────────────────────────┐
│                              CLASS DIAGRAM                               │
└─────────────────────────────────────────────────────────────────────────┘

┌────────────────────────┐         ┌────────────────────────┐
│         Book           │         │       CartItem         │
├────────────────────────┤         ├────────────────────────┤
│ - id: string           │         │ - book: Book           │
│ - title: string        │◄────────│ - quantity: number     │
│ - author: string       │    1  * └────────────────────────┘
│ - category: string     │                    │
│ - price: number        │                    │ *
│ - oldPrice: number     │                    │
│ - image: string        │                    ▼ 1
│ - condition: string    │         ┌────────────────────────┐
│ - description: string  │         │        Order           │
└────────────────────────┘         ├────────────────────────┤
                                   │ - id: string           │
┌────────────────────────┐         │ - userId: string       │
│         User           │◄────────│ - items: CartItem[]    │
├────────────────────────┤    1  * │ - totalPrice: number   │
│ - id: string           │         │ - status: string       │
│ - email: string        │         │ - paymentMethod: string│
│ - role: AppRole        │         │ - deliveryAddress: str │
└────────────────────────┘         │ - createdAt: Date      │
         │                         └────────────────────────┘
         │ 1
         │
         ▼ *
┌────────────────────────┐
│     UserListing        │
├────────────────────────┤
│ - id: string           │
│ - userId: string       │
│ - title: string        │
│ - author: string       │
│ - price: number        │
│ - condition: string    │
│ - status: string       │
│ - contactEmail: string │
│ - contactPhone: string │
└────────────────────────┘

Legend:
────────  Association
◄────────  Composition/Aggregation
1  *      One-to-Many relationship`}
            </pre>
          </div>
        </section>

        {/* 7. Application Flow */}
        <section className="mb-12 print:mb-8 page-break-before">
          <h2 className="text-2xl font-bold mb-4 border-b-2 border-gray-900 pb-2">7. Application Flow Diagram</h2>
          
          <h3 className="text-xl font-semibold mb-3 mt-6">7.1 User Flow</h3>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-300 mb-6">
            <pre className="text-sm font-mono whitespace-pre-wrap">
{`                              ┌──────────────────┐
                              │   User Visits    │
                              │    Website       │
                              └────────┬─────────┘
                                       │
                                       ▼
                              ┌──────────────────┐
                              │  Authenticated?  │
                              └────────┬─────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │ NO               │                  │ YES
                    ▼                  │                  ▼
           ┌────────────────┐          │         ┌────────────────┐
           │  Browse Books  │          │         │  Full Access   │
           │  (Guest Mode)  │          │         │                │
           └───────┬────────┘          │         └───────┬────────┘
                   │                   │                 │
                   ▼                   │                 ▼
           ┌────────────────┐          │    ┌───────────────────────┐
           │  Add to Cart   │          │    │  • Browse Books       │
           └───────┬────────┘          │    │  • Manage Cart        │
                   │                   │    │  • Checkout           │
                   ▼                   │    │  • View Orders        │
           ┌────────────────┐          │    │  • Sell Books         │
           │ Login Required │          │    │  • Account Settings   │
           └───────┬────────┘          │    └───────────────────────┘
                   │                   │
                   ▼                   │
           ┌────────────────┐          │
           │   Auth Page    │──────────┘
           │ Login / Signup │
           └────────────────┘`}
            </pre>
          </div>

          <h3 className="text-xl font-semibold mb-3 mt-6">7.2 Checkout Flow</h3>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-300 mb-6">
            <pre className="text-sm font-mono whitespace-pre-wrap">
{`┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    Cart     │────►│  Checkout   │────►│   Payment   │
│   Review    │     │   Details   │     │   Method    │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                    ┌──────────────────────────┼──────────────────────────┐
                    │                          │                          │
                    ▼                          ▼                          ▼
             ┌─────────────┐            ┌─────────────┐            ┌─────────────┐
             │     COD     │            │     UPI     │            │    Card     │
             │   (Cash)    │            │   Payment   │            │   Payment   │
             └──────┬──────┘            └──────┬──────┘            └──────┬──────┘
                    │                          │                          │
                    └──────────────────────────┼──────────────────────────┘
                                               │
                                               ▼
                                    ┌─────────────────────┐
                                    │   Order Created     │
                                    │   in Database       │
                                    └──────────┬──────────┘
                                               │
                                               ▼
                                    ┌─────────────────────┐
                                    │ Order Confirmation  │
                                    │      Page           │
                                    └─────────────────────┘`}
            </pre>
          </div>
        </section>

        {/* 8. Security Architecture */}
        <section className="mb-12 print:mb-8">
          <h2 className="text-2xl font-bold mb-4 border-b-2 border-gray-900 pb-2">8. Security Architecture</h2>
          
          <h3 className="text-xl font-semibold mb-3 mt-6">8.1 Authentication Flow</h3>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-300 mb-6">
            <pre className="text-sm font-mono whitespace-pre-wrap">
{`┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────►│  Supabase   │────►│  Database   │
│   Request   │     │    Auth     │     │   Access    │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  Valid JWT? │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │ NO         │            │ YES
              ▼            │            ▼
       ┌─────────────┐     │     ┌─────────────┐
       │    401      │     │     │ RLS Policy  │
       │Unauthorized │     │     │   Check     │
       └─────────────┘     │     └──────┬──────┘
                           │            │
                           │   ┌────────┼────────┐
                           │   │ PASS   │        │ FAIL
                           │   ▼        │        ▼
                           │ ┌───────┐  │  ┌───────────┐
                           │ │ Data  │  │  │    403    │
                           │ │Access │  │  │ Forbidden │
                           │ └───────┘  │  └───────────┘
                           └────────────┘`}
            </pre>
          </div>

          <h3 className="text-xl font-semibold mb-3 mt-6">8.2 Row Level Security (RLS) Policies</h3>
          <table className="w-full border-collapse border border-gray-300 mb-6">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Table</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Policy</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Access Rule</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">books</td>
                <td className="border border-gray-300 px-4 py-2">SELECT</td>
                <td className="border border-gray-300 px-4 py-2">Public (anyone can view)</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">books</td>
                <td className="border border-gray-300 px-4 py-2">INSERT/UPDATE/DELETE</td>
                <td className="border border-gray-300 px-4 py-2">Admin only</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">orders</td>
                <td className="border border-gray-300 px-4 py-2">SELECT</td>
                <td className="border border-gray-300 px-4 py-2">Own orders + Admin</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">orders</td>
                <td className="border border-gray-300 px-4 py-2">INSERT</td>
                <td className="border border-gray-300 px-4 py-2">Authenticated users</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">user_listings</td>
                <td className="border border-gray-300 px-4 py-2">All operations</td>
                <td className="border border-gray-300 px-4 py-2">Own listings + Admin</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">user_roles</td>
                <td className="border border-gray-300 px-4 py-2">All operations</td>
                <td className="border border-gray-300 px-4 py-2">Admin only</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* 9. Features */}
        <section className="mb-12 print:mb-8">
          <h2 className="text-2xl font-bold mb-4 border-b-2 border-gray-900 pb-2">9. Features & Functionality</h2>
          
          <table className="w-full border-collapse border border-gray-300 mb-6">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Module</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Features</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-semibold align-top">Authentication</td>
                <td className="border border-gray-300 px-4 py-2">
                  • Email/Password signup and login<br/>
                  • Session management with JWT<br/>
                  • Protected routes<br/>
                  • Auto sign-out on token expiry
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 font-semibold align-top">Book Catalog</td>
                <td className="border border-gray-300 px-4 py-2">
                  • Search by title/author<br/>
                  • Filter by category<br/>
                  • Sort by price (low/high)<br/>
                  • Filter by condition (new/old)<br/>
                  • Collection grouping by author
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-semibold align-top">Shopping Cart</td>
                <td className="border border-gray-300 px-4 py-2">
                  • Add/remove items<br/>
                  • Quantity management<br/>
                  • Price calculation<br/>
                  • Persistent cart (localStorage)
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 font-semibold align-top">Checkout</td>
                <td className="border border-gray-300 px-4 py-2">
                  • Multiple payment methods (COD, UPI, Card)<br/>
                  • Address input<br/>
                  • Order confirmation<br/>
                  • Email/Phone contact
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-semibold align-top">User Features</td>
                <td className="border border-gray-300 px-4 py-2">
                  • View order history<br/>
                  • Sell books (create listings)<br/>
                  • Manage listings<br/>
                  • Account settings
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 font-semibold align-top">Admin Panel</td>
                <td className="border border-gray-300 px-4 py-2">
                  • Manage all books<br/>
                  • View all orders<br/>
                  • User role management<br/>
                  • Approve/reject listings
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-semibold align-top">UI/UX</td>
                <td className="border border-gray-300 px-4 py-2">
                  • Dark/Light theme toggle<br/>
                  • Responsive design<br/>
                  • Search suggestions dropdown<br/>
                  • Toast notifications<br/>
                  • Animations and transitions
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* 10. Dependencies */}
        <section className="mb-12 print:mb-8">
          <h2 className="text-2xl font-bold mb-4 border-b-2 border-gray-900 pb-2">10. Dependencies</h2>
          
          <h3 className="text-xl font-semibold mb-3 mt-6">10.1 Core Dependencies</h3>
          <table className="w-full border-collapse border border-gray-300 mb-6 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2 text-left">Package</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Version</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border border-gray-300 px-3 py-1">react</td><td className="border border-gray-300 px-3 py-1">18.3.1</td><td className="border border-gray-300 px-3 py-1">UI Library</td></tr>
              <tr className="bg-gray-50"><td className="border border-gray-300 px-3 py-1">react-dom</td><td className="border border-gray-300 px-3 py-1">18.3.1</td><td className="border border-gray-300 px-3 py-1">React DOM Renderer</td></tr>
              <tr><td className="border border-gray-300 px-3 py-1">react-router-dom</td><td className="border border-gray-300 px-3 py-1">6.30.1</td><td className="border border-gray-300 px-3 py-1">Client Routing</td></tr>
              <tr className="bg-gray-50"><td className="border border-gray-300 px-3 py-1">@supabase/supabase-js</td><td className="border border-gray-300 px-3 py-1">2.86.0</td><td className="border border-gray-300 px-3 py-1">Backend Client</td></tr>
              <tr><td className="border border-gray-300 px-3 py-1">@tanstack/react-query</td><td className="border border-gray-300 px-3 py-1">5.83.0</td><td className="border border-gray-300 px-3 py-1">Server State</td></tr>
              <tr className="bg-gray-50"><td className="border border-gray-300 px-3 py-1">tailwindcss</td><td className="border border-gray-300 px-3 py-1">Latest</td><td className="border border-gray-300 px-3 py-1">CSS Framework</td></tr>
            </tbody>
          </table>

          <h3 className="text-xl font-semibold mb-3 mt-6">10.2 UI Dependencies</h3>
          <table className="w-full border-collapse border border-gray-300 mb-6 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2 text-left">Package</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border border-gray-300 px-3 py-1">@radix-ui/*</td><td className="border border-gray-300 px-3 py-1">Headless UI primitives (Dialog, Dropdown, etc.)</td></tr>
              <tr className="bg-gray-50"><td className="border border-gray-300 px-3 py-1">lucide-react</td><td className="border border-gray-300 px-3 py-1">Icon library</td></tr>
              <tr><td className="border border-gray-300 px-3 py-1">sonner</td><td className="border border-gray-300 px-3 py-1">Toast notifications</td></tr>
              <tr className="bg-gray-50"><td className="border border-gray-300 px-3 py-1">class-variance-authority</td><td className="border border-gray-300 px-3 py-1">Component variants</td></tr>
              <tr><td className="border border-gray-300 px-3 py-1">tailwind-merge</td><td className="border border-gray-300 px-3 py-1">Tailwind class merging</td></tr>
            </tbody>
          </table>
        </section>

        {/* 11. Deployment */}
        <section className="mb-12 print:mb-8">
          <h2 className="text-2xl font-bold mb-4 border-b-2 border-gray-900 pb-2">11. Deployment</h2>
          
          <h3 className="text-xl font-semibold mb-3 mt-6">11.1 Deployment Architecture</h3>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-300 mb-6">
            <pre className="text-sm font-mono whitespace-pre-wrap">
{`┌─────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT STACK                          │
└─────────────────────────────────────────────────────────────┘

     ┌──────────────────────────────────────────────────┐
     │                   LOVABLE                         │
     │              (Hosting Platform)                   │
     │  ┌──────────────────────────────────────────────┐ │
     │  │          Static Frontend Build               │ │
     │  │         (React + Vite + TypeScript)          │ │
     │  └──────────────────────────────────────────────┘ │
     └──────────────────────┬───────────────────────────┘
                            │
                            │ HTTPS API Calls
                            ▼
     ┌──────────────────────────────────────────────────┐
     │              SUPABASE CLOUD                       │
     │  ┌────────────┐ ┌────────────┐ ┌────────────┐    │
     │  │ PostgreSQL │ │    Auth    │ │  Storage   │    │
     │  │  Database  │ │  Service   │ │   Bucket   │    │
     │  └────────────┘ └────────────┘ └────────────┘    │
     │  ┌────────────────────────────────────────────┐  │
     │  │            Edge Functions (Deno)            │  │
     │  └────────────────────────────────────────────┘  │
     └──────────────────────────────────────────────────┘`}
            </pre>
          </div>

          <h3 className="text-xl font-semibold mb-3 mt-6">11.2 Environment Variables</h3>
          <table className="w-full border-collapse border border-gray-300 mb-6">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Variable</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-mono text-sm">VITE_SUPABASE_URL</td>
                <td className="border border-gray-300 px-4 py-2">Supabase project URL</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 font-mono text-sm">VITE_SUPABASE_ANON_KEY</td>
                <td className="border border-gray-300 px-4 py-2">Supabase anonymous/public key</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-300 text-center text-gray-500 text-sm">
          <p>BookPard - Online Book Marketplace</p>
          <p>Project Documentation Report</p>
          <p>Generated on {new Date().toLocaleDateString()}</p>
        </footer>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .page-break-before {
            page-break-before: always;
          }
          .page-break-after {
            page-break-after: always;
          }
          @page {
            margin: 1.5cm;
            size: A4;
          }
        }
      `}</style>
    </div>
  );
};

export default ProjectDocumentation;
