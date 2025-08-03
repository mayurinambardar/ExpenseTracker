import React, { useEffect, useState } from "react";

function AddExpenseForm() {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  
  const [list, setList] = useState(() => {
    const stored = localStorage.getItem("expenseList");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("expenseList", JSON.stringify(list));
  }, [list]);

  const [showMonthly, setShowMonthly] = useState(false);
  const [showYearly, setShowYearly] = useState(false);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [yearlyTotal, setYearlyTotal] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (!category || !amount || !date || !paymentMode) return;

    const newEntry = {
      category,
      amount: parseFloat(amount),
      date,
      paymentMode,
    };

    if (editIndex !== null) {
      const updatedList = [...list];
      updatedList[editIndex] = newEntry;
      setList(updatedList);
      setEditIndex(null);
    } else {
      setList([...list, newEntry]);
    }

    setCategory("");
    setAmount("");
    setDate("");
    setPaymentMode("");
  };

  const handleEdit = (index) => {
    const item = list[index];
    setCategory(item.category);
    setAmount(item.amount);
    setDate(item.date);
    setPaymentMode(item.paymentMode);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedList = list.filter((_, i) => i !== index);
    setList(updatedList);
  };

  const handleMonthlyClick = () => {
    if (list.length === 0) return;
    setShowMonthly(!showMonthly);
    setShowYearly(false);
  };

  const handleYearlyClick = () => {
    if (list.length === 0) return;
    setShowYearly(!showYearly);
    setShowMonthly(false);
  };

  const calculateMonthlyTotal = () => {
    if (!selectedMonth || !selectedYear) return;

    const total = list
      .filter((item) => {
        const itemDate = new Date(item.date);
        return (
          itemDate.getMonth() + 1 === parseInt(selectedMonth) &&
          itemDate.getFullYear() === parseInt(selectedYear)
        );
      })
      .reduce((sum, item) => sum + item.amount, 0);

    setMonthlyTotal(total);
  };

  const calculateYearlyTotal = () => {
    if (!selectedYear) return;

    const total = list
      .filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate.getFullYear() === parseInt(selectedYear);
      })
      .reduce((sum, item) => sum + item.amount, 0);

    setYearlyTotal(total);
  };

  const handleExportCSV = () => {
    if (list.length === 0) return;

    const csvData = [
      ["Category", "Amount", "Date", "Payment Mode"],
      ...list.map((item) => [
        item.category,
        item.amount,
        item.date,
        item.paymentMode,
      ]),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      csvData.map((row) => row.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "expenses.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-700">Add Expense</h1>
      <form
        onSubmit={handleOnSubmit}
        className="grid grid-cols-1 gap-4 bg-white shadow-md rounded p-4"
      >
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded p-2"
        >
          <option value="">Select Category</option>
          <option value="Food">Food</option>
          <option value="Rent">Rent</option>
          <option value="Travel">Travel</option>
          <option value="Groceries">Groceries</option>
          <option value="Utilities">Utilities</option>
          <option value="Health">Health</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Shopping">Shopping</option>
          <option value="Transport">Transport</option>
          <option value="Savings">Savings</option>
          <option value="Insurance">Insurance</option>
          <option value="Subscription">Subscription</option>
          <option value="Investment">Investment</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Mobile & Internet">Mobile & Internet</option>
          <option value="Loan Repayment">Loan Repayment</option>
          <option value="Miscellaneous">Miscellaneous</option>
        </select>

        <input
          type="number"
          value={amount}
          placeholder="Amount"
          onChange={(e) => setAmount(e.target.value)}
          className="border rounded p-2"
          required
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded p-2"
          required
        />

        <select
          value={paymentMode}
          onChange={(e) => setPaymentMode(e.target.value)}
          className="border rounded p-2"
        >
          <option value="">Payment Mode</option>
          <option value="Cash">Cash</option>
          <option value="UPI">UPI</option>
        </select>

        <button
          type="submit"
          className={`${
            editIndex !== null ? "bg-orange-600" : "bg-blue-600"
          } hover:brightness-110 text-white py-2 px-4 rounded`}
        >
          {editIndex !== null ? "Update Expense" : "Add Expense"}
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-3 justify-center">
        <button
          onClick={handleMonthlyClick}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
        >
          Monthly Expense
        </button>

        <button
          onClick={handleYearlyClick}
          className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded"
        >
          Yearly Expense
        </button>

        <button
          onClick={handleExportCSV}
          className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded"
        >
          Export to CSV
        </button>
      </div>

      {list.length === 0 && (showMonthly || showYearly) && (
        <p className="mt-4 text-center text-red-600">
          No expenses available. Please add some first.
        </p>
      )}

      {showMonthly && list.length > 0 && (
        <div className="mt-4">
          <label className="block mb-1">Select Month and Year:</label>
          <div className="flex gap-2">
            <select
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">Month</option>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Year"
              onChange={(e) => setSelectedYear(e.target.value)}
              className="border p-2 rounded"
            />
            <button
              onClick={calculateMonthlyTotal}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              Show Total
            </button>
          </div>
          <p className="mt-2 text-blue-700 font-medium">
            Monthly Total: ₹{monthlyTotal}
          </p>
        </div>
      )}

      {showYearly && list.length > 0 && (
        <div className="mt-4">
          <label className="block mb-1">Enter Year:</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Year"
              onChange={(e) => setSelectedYear(e.target.value)}
              className="border p-2 rounded"
            />
            <button
              onClick={calculateYearlyTotal}
              className="bg-purple-600 text-white px-3 py-1 rounded"
            >
              Show Total
            </button>
          </div>
          <p className="mt-2 text-purple-700 font-medium">
            Yearly Total: ₹{yearlyTotal}
          </p>
        </div>
      )}

      <ul className="mt-6 space-y-2">
        {list.map((item, index) => (
          <li
            key={index}
            className="p-3 border border-gray-300 rounded shadow-sm bg-gray-50 flex justify-between items-center"
          >
            <div>
              <strong>{item.category}</strong> — ₹{item.amount} on {item.date} via {item.paymentMode}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(index)}
                className="text-sm bg-orange-500 text-white px-2 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(index)}
                className="text-sm bg-red-600 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AddExpenseForm;
