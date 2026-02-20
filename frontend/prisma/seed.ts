import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Education",
  "Travel",
  "Groceries",
  "Subscriptions",
];

const statuses = ["pending", "completed", "cancelled"] as const;

function randomDate(start: Date, end: Date) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const expenseTemplates: Array<{
  title: string;
  amountRange: [number, number];
  category: string;
  description: string;
}> = [
  { title: "Grocery Shopping at BigBasket", amountRange: [1200, 5500], category: "Groceries", description: "Weekly groceries including vegetables, fruits, and dairy" },
  { title: "Uber Ride to Airport", amountRange: [650, 1200], category: "Transportation", description: "Cab ride to airport" },
  { title: "Netflix Annual Subscription", amountRange: [5999, 6490], category: "Subscriptions", description: "Annual premium plan renewal" },
  { title: "Electricity Bill", amountRange: [1800, 2800], category: "Bills & Utilities", description: "Monthly electricity bill" },
  { title: "Team Dinner at Restaurant", amountRange: [2500, 5500], category: "Food & Dining", description: "Team celebration dinner" },
  { title: "Amazon Purchase - Electronics", amountRange: [2999, 15000], category: "Shopping", description: "Online shopping order" },
  { title: "Movie Night - PVR Cinemas", amountRange: [800, 1500], category: "Entertainment", description: "Movie tickets and snacks" },
  { title: "Health Checkup Package", amountRange: [3500, 7500], category: "Healthcare", description: "Annual comprehensive health checkup" },
  { title: "Udemy Course", amountRange: [399, 1999], category: "Education", description: "Online course purchase" },
  { title: "Flight and Hotel Booking", amountRange: [12000, 25000], category: "Travel", description: "Trip booking" },
  { title: "Monthly Metro Pass", amountRange: [1200, 1800], category: "Transportation", description: "Metro monthly pass" },
  { title: "Internet Bill", amountRange: [799, 1299], category: "Bills & Utilities", description: "Broadband renewal" },
  { title: "Zara Shopping", amountRange: [3500, 12000], category: "Shopping", description: "Clothing purchase" },
  { title: "Swiggy Food Orders", amountRange: [400, 3500], category: "Food & Dining", description: "Food delivery orders" },
  { title: "Gym Membership", amountRange: [8000, 15000], category: "Healthcare", description: "Gym membership renewal" },
  { title: "Spotify Premium", amountRange: [119, 149], category: "Subscriptions", description: "Monthly music subscription" },
  { title: "Petrol for Car", amountRange: [2500, 5000], category: "Transportation", description: "Fuel refill" },
  { title: "DMart Groceries", amountRange: [1500, 4500], category: "Groceries", description: "Monthly grocery run" },
  { title: "Coffee at Starbucks", amountRange: [250, 600], category: "Food & Dining", description: "Coffee and snack" },
  { title: "Book Purchase", amountRange: [299, 899], category: "Education", description: "Technical book" },
  { title: "Mobile Recharge", amountRange: [299, 799], category: "Bills & Utilities", description: "Prepaid recharge" },
  { title: "Concert Tickets", amountRange: [1500, 5000], category: "Entertainment", description: "Live event tickets" },
  { title: "Pharmacy - Medicines", amountRange: [200, 1500], category: "Healthcare", description: "Medicine purchase" },
  { title: "Ola Auto", amountRange: [80, 250], category: "Transportation", description: "Short auto ride" },
  { title: "YouTube Premium", amountRange: [129, 159], category: "Subscriptions", description: "Annual plan" },
  { title: "Blinkit Order", amountRange: [300, 1200], category: "Groceries", description: "Quick grocery delivery" },
  { title: "Lunch at Office Cafeteria", amountRange: [150, 350], category: "Food & Dining", description: "Daily lunch" },
  { title: "Coursera Subscription", amountRange: [2999, 4999], category: "Education", description: "Professional certificate" },
  { title: "Water Bill", amountRange: [200, 500], category: "Bills & Utilities", description: "Monthly water bill" },
  { title: "Weekend Getaway", amountRange: [8000, 20000], category: "Travel", description: "Hotel and local travel" },
];

async function main() {
  console.log("Seeding database...");

  await prisma.expense.deleteMany();

  const startDate = new Date("2025-01-01");
  const endDate = new Date();

  const expenses: Array<{
    title: string;
    amount: number;
    category: string;
    status: string;
    description: string;
    date: Date;
  }> = [];

  for (let round = 0; round < 4; round++) {
    for (const t of expenseTemplates) {
      const [min, max] = t.amountRange;
      const amount = parseFloat((min + Math.random() * (max - min)).toFixed(2));
      expenses.push({
        title: t.title,
        amount,
        category: t.category,
        status: pick(statuses),
        description: t.description,
        date: randomDate(startDate, endDate),
      });
    }
  }

  for (let i = 0; i < 120; i++) {
    const cat = pick(categories);
    const amount = parseFloat((Math.random() * 4800 + 50).toFixed(2));
    expenses.push({
      title: `Expense ${i + 1} - ${cat}`,
      amount,
      category: cat,
      status: pick(statuses),
      description: `Sample expense description for item ${i + 1}`,
      date: randomDate(startDate, endDate),
    });
  }

  await prisma.expense.createMany({ data: expenses });

  const total = expenses.length;
  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  console.log(`Seeded ${total} expenses (Total: Rs.${totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
