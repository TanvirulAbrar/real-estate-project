app/
│
├── (public)/                        # 🌍 Public pages
│   ├── page.tsx                    # Home +
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   │
│   ├── properties/
│   │   ├── page.tsx                # Listing +
│   │   └── [id]/page.tsx           # Details
│   │
│   ├── agents/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   │
│   └── search/
│       ├── page.tsx
│       └── results/page.tsx
│
├── (auth)/                         # 🔐 Auth pages +
│   ├── login/page.tsx
│   ├── register/page.tsx
│
├── (dashboard)/                    # 👤 Client/User Dashboard
│   ├── layout.tsx                 # Sidebar layout
│   ├── page.tsx                  # Dashboard overview
│   │
│   ├── profile/page.tsx
│   ├── favorites/page.tsx
│   ├── appointments/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   │
│   ├── inquiries/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx         # Chat/messages
│   │
│   ├── offers/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   │
│   ├── transactions/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   │
│   ├── notifications/page.tsx
│   └── settings/page.tsx
│
├── (agent)/                        # 🏢 Agent Dashboard
│   ├── layout.tsx
│   ├── dashboard/page.tsx
│   │
│   ├── properties/
│   │   ├── page.tsx              # My properties
│   │   ├── add/page.tsx
│   │   └── [id]/edit/page.tsx
│   │
│   ├── inquiries/page.tsx
│   ├── appointments/page.tsx
│   └── offers/page.tsx
│
├── (admin)/                        # 🛠 Admin Dashboard
│   ├── layout.tsx
│   ├── dashboard/page.tsx
│   ├── analytics/page.tsx
│   │
│   ├── users/page.tsx
│   ├── properties/page.tsx
│   ├── agents/page.tsx
│   ├── offers/page.tsx
│   └── transactions/page.tsx
│
├── ai/                             # 🤖 AI Features
│   ├── chat/page.tsx
│   ├── recommendations/page.tsx
│   ├── review-summary/page.tsx
│   └── generate-description/page.tsx
│
├── notifications/page.tsx          # Global notifications (optional alt)
│
├── faq/page.tsx                    # Extra required pages
├── terms/page.tsx
├── privacy/page.tsx
│
├── not-found.tsx                   # 404
└── layout.tsx                      # Root layout