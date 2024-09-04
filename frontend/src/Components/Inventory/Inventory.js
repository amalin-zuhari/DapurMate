import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { Modal, Button, Form, Table, Alert, Pagination } from "react-bootstrap";
import "../../Styles/Inventory.css";
import moment from "moment";

// Main component to manage the inventory of items
const Inventory = () => {
  // State hooks to manage various aspects of the inventory component
  const [items, setItems] = useState([]); // Holds the list of items in the inventory
  const [show, setShow] = useState(false); // Controls the visibility of the modal
  const [searchQuery, setSearchQuery] = useState(""); // Manages the search query input
  const [sortConfig, setSortConfig] = useState({
    key: "expirationDate",
    direction: "ascending",
  }); // Stores sorting configuration for the table
  const [formData, setFormData] = useState({
    itemName: "",
    quantity: "",
    unitOfMeasurement: "", // Holds the unit of measurement for an item
    optimalStockLevel: "",
    expirationDate: "",
    category: "Vegetables",
  }); // Manages form data for adding/editing items
  const [notification, setNotification] = useState({
    type: "",
    message: "",
    show: false,
  }); // Controls notification alerts
  const [formValid, setFormValid] = useState(true); // Validates form fields
  const [filterType, setFilterType] = useState(null); // Determines the type of filter applied to the items list

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1); // Tracks the current page for pagination
  const [itemsPerPage] = useState(5); // Sets the number of items displayed per page

  // Array to define possible units of measurement for inventory items
  const units = [
    "Kilogram",
    "Gram",
    "Liter",
    "Milliliter",
    "Box(es)",
    "Piece",
    "Bottle",
    "Pack",
    "Carton",
  ];

  // Array to define possible categories for inventory items
  const categories = ["Meat", "Vegetables", "Dairy", "Fruits", "Beverages", "Snacks"];
  const expirationThreshold = 7; // Threshold in days to trigger a nearing expiration alert

  const [editId, setEditId] = useState(null); // Stores the ID of the item currently being edited

  // Function to check if an item is below the optimal stock level
  const isLowStock = (quantity, optimalStockLevel) => {
    return quantity < optimalStockLevel;
  };

  // Function to determine if an item is below the optimal stock level
  const isBelowOptimalStock = (quantity, optimalStockLevel) =>
    quantity < optimalStockLevel;

  // Function to determine if an item is above the optimal stock level by 20%
  const isAboveOptimalStock = (quantity, optimalStockLevel) =>
    quantity > optimalStockLevel * 1.2; // 20% above optimal

  // Function to check if an item is expired
  const isExpired = (expirationDate) => {
    const expiration = moment(expirationDate, "YYYY-MM-DD").toDate();
    const now = new Date();
    return expiration < now;
  };

  // Function to check if an item is nearing expiration
  const isApproachingExpiration = (expirationDate) => {
    const expiration = moment(expirationDate, "YYYY-MM-DD").toDate();
    const now = new Date();
    const diffTime = expiration - now;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays <= expirationThreshold && diffDays > 0;
  };

  // Function to check notifications for low stock, nearing expiration, and expired items
  const checkNotifications = useCallback((items) => {
    const lowStockItems = items.filter((item) =>
      isLowStock(item.quantity, item.optimalStockLevel)
    );
    const nearingExpirationItems = items.filter((item) =>
      isApproachingExpiration(item.expirationDate)
    );
    const expiredItems = items.filter((item) => isExpired(item.expirationDate));

    if (lowStockItems.length > 0) {
      showNotification(
        "warning",
        `${lowStockItems.length} items are low in stock!`
      );
    }
    if (nearingExpirationItems.length > 0) {
      showNotification(
        "warning",
        `${nearingExpirationItems.length} items are nearing expiration!`
      );
    }
    if (expiredItems.length > 0) {
      showNotification("danger", `${expiredItems.length} items have expired!`);
    }
  }, []);

  // Function to close the modal and reset form data
  const handleClose = () => {
    setShow(false);
    setFormValid(true);
    setFormData({
      itemName: "",
      quantity: "",
      expirationDate: "",
      category: "Vegetables",
      optimalStockLevel: "",
      unitOfMeasurement: "", // Reset unitOfMeasurement
    });
  };

  // Function to open the modal
  const handleShow = () => setShow(true);

  // Function to fetch items from the server
  const fetchItems = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/inventory");
      setItems(res.data);
      checkNotifications(res.data);
    } catch (err) {
      console.error("Error fetching items:", err);
      showNotification("error", "Failed to fetch items.");
    }
  }, [checkNotifications]);

  // useEffect hook to fetch items when the component mounts
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Function to show a notification message
  const showNotification = (type, message) => {
    setNotification({ type, message, show: true });
    setTimeout(() => {
      setNotification({ type: "", message: "", show: false });
    }, 3000); // Notification disappears after 3 seconds
  };

  // Function to request sorting of items by a specific key
  const requestSort = (key) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Function to set the filter type based on the clicked stat box
  const handleStatBoxClick = (type) => {
    setFilterType(type);
  };

  // Memoized function to filter items based on search query or filter type
  const filteredItems = useMemo(() => {
    let filtered = items;

    if (filterType === "lowStock") {
      filtered = items.filter((item) =>
        isLowStock(item.quantity, item.optimalStockLevel)
      );
    } else if (filterType === "nearingExpiration") {
      filtered = items.filter((item) =>
        isApproachingExpiration(item.expirationDate)
      );
    } else if (filterType === "expired") {
      filtered = items.filter((item) => isExpired(item.expirationDate));
    } else if (searchQuery) {
      filtered = items.filter((item) =>
        item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [filterType, searchQuery, items]);

  // Memoized function to sort filtered items based on the sort configuration
  const sortedItems = useMemo(() => {
    let sortableItems = [...filteredItems];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredItems, sortConfig]);

  // Pagination logic to determine the current items to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);

  // Function to handle form submission for adding or editing an item
  const handleSubmit = async () => {
    if (
      !formData.itemName ||
      !formData.quantity ||
      !formData.unitOfMeasurement || // Check if unitOfMeasurement is provided
      !formData.optimalStockLevel || // Check if optimalStockLevel is provided
      !formData.expirationDate ||
      !formData.category
    ) {
      setFormValid(false); // If any field is missing, set form as invalid
      return;
    }

    console.log("Form Data before submission:", formData);

    const submittedData = {
      ...formData,
      quantity: parseFloat(formData.quantity),
      optimalStockLevel: parseFloat(formData.optimalStockLevel),
    };

    try {
      if (editId) {
        await axios.put(
          `http://localhost:5000/api/inventory/${editId}`,
          submittedData
        );
        showNotification("success", "Item updated successfully.");
      } else {
        await axios.post("http://localhost:5000/api/inventory", submittedData);
        showNotification("success", "Item added successfully.");
      }

      setFormData({
        itemName: "",
        quantity: "",
        unitOfMeasurement: "", // Reset unitOfMeasurement
        optimalStockLevel: "", // Reset optimalStockLevel
        expirationDate: "",
        category: "Vegetables",
      });

      setEditId(null); // Reset editId after submission
      handleClose(); // Close the modal after submission
      fetchItems(); // Refresh the items list after submission
    } catch (err) {
      console.error("Error saving item:", err.message); // Log error
      showNotification("error", "Failed to save item.");
    }
  };

  // Function to handle date change in the form
  const handleDateChange = (e) => {
    setFormData({ ...formData, expirationDate: e.target.value });
  };

  // Function to handle editing an existing item
  const handleEdit = (item) => {
    setEditId(item._id); // Set the ID of the item to be edited
    setFormData({
      itemName: item.itemName,
      quantity: item.quantity,
      expirationDate: moment(item.expirationDate).format("YYYY-MM-DD"),
      category: item.category,
      optimalStockLevel: item.optimalStockLevel, // Set optimalStockLevel
      unitOfMeasurement: item.unitOfMeasurement, // Set unitOfMeasurement
    });
    handleShow(); // Open the modal with the form data pre-filled
  };

  // Function to handle deleting an item from the inventory
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/inventory/${id}`);
      showNotification("success", "Item deleted successfully.");
      fetchItems(); // Refresh the items list after deletion
    } catch (err) {
      console.error("Error deleting item:", err);
      showNotification("error", "Failed to delete item.");
    }
  };

  // Function to handle pagination click events
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="inventory-container">
      {/* Notification alert */}
      {notification.show && (
        <Alert
          variant={
            notification.type === "success"
              ? "success"
              : notification.type === "warning"
              ? "warning"
              : "danger"
          }
        >
          {notification.message}
        </Alert>
      )}
      {/* Summary statistics and filtering options */}
      <div className="summary-statistics">
        <div
          className="stat-box clickable"
          onClick={() => handleStatBoxClick(null)}
          style={{ cursor: "pointer" }}
        >
          Total Items: {items.length}
        </div>
        <div
          className="stat-box clickable"
          onClick={() => handleStatBoxClick("lowStock")}
          style={{ cursor: "pointer" }}
        >
          Low Stock Items:{" "}
          {
            items.filter((item) =>
              isLowStock(item.quantity, item.optimalStockLevel)
            ).length
          }
        </div>
        <div
          className="stat-box clickable"
          onClick={() => handleStatBoxClick("nearingExpiration")}
          style={{ cursor: "pointer" }}
        >
          Items Nearing Expiration:{" "}
          {
            items.filter((item) => isApproachingExpiration(item.expirationDate))
              .length
          }
        </div>
        <div
          className="stat-box clickable"
          onClick={() => handleStatBoxClick("expired")}
          style={{ cursor: "pointer" }}
        >
          Expired Items:{" "}
          {items.filter((item) => isExpired(item.expirationDate)).length}
        </div>
      </div>
      {/* Actions row for adding items and searching */}
      <div className="actions-row">
        <Button onClick={handleShow}>Add Item</Button>
        <input
          type="text"
          placeholder="Search by item name"
          className="search-bar"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Modal for adding/editing items */}
      <Modal show={show} onHide={handleClose} className="inventory-modal">
        <Modal.Header closeButton>
          <Modal.Title>{editId ? "Edit Item" : "Add Item"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!formValid && (
            <Alert variant="danger">All fields are required.</Alert>
          )}
          <Form>
            <Form.Group controlId="formItemName">
              <Form.Label>
                Item Name <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter item name"
                value={formData.itemName}
                onChange={(e) =>
                  setFormData({ ...formData, itemName: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group controlId="formQuantity">
              <Form.Label>
                Quantity <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter quantity"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group controlId="formUnitOfMeasurement">
              <Form.Label>
                Unit of Measurement <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                as="select"
                value={formData.unitOfMeasurement}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    unitOfMeasurement: e.target.value,
                  })
                }
                required
              >
                <option value="">Select Unit</option>
                {units.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formOptimalStockLevel">
              <Form.Label>
                Optimal Stock Level <span style={{ color: "red" }}>*</span>
                <i
                  className="bi bi-question-circle ms-2"
                  data-toggle="tooltip"
                  data-placement="top"
                  title="The optimal stock level is the quantity of items you prefer to keep in stock. If the quantity falls below this level, a low stock alert will be triggered."
                  style={{ cursor: "pointer" }}
                ></i>
              </Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter optimal stock level"
                value={formData.optimalStockLevel}
                onChange={(e) => {
                  const value = e.target.value;
                  if (
                    value === "" ||
                    (Number.isInteger(parseInt(value)) && parseInt(value) >= 0)
                  ) {
                    setFormData({
                      ...formData,
                      optimalStockLevel: value,
                    });
                  }
                }}
                required
              />
            </Form.Group>

            <Form.Group controlId="formExpirationDate">
              <Form.Label>
                Expiration Date <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                type="date"
                value={formData.expirationDate}
                onChange={handleDateChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formCategory">
              <Form.Label>
                Category <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                as="select"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {editId ? "Save Changes" : "Add Item"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Table displaying inventory items */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th onClick={() => requestSort("itemName")}>Item Name</th>
            <th onClick={() => requestSort("quantity")}>Quantity</th>
            <th onClick={() => requestSort("expirationDate")}>
              Expiration Date
            </th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr
              key={item._id}
              className={
                isExpired(item.expirationDate)
                  ? "bg-danger text-white"
                  : isApproachingExpiration(item.expirationDate)
                  ? "bg-warning"
                  : ""
              }
            >
              <td>{item.itemName}</td>
              <td
                className={
                  isLowStock(item.quantity, item.optimalStockLevel)
                    ? "text-danger"
                    : ""
                }
              >
                {item.quantity} {item.unitOfMeasurement}
                {isLowStock(item.quantity, item.optimalStockLevel) && (
                  <i className="bi bi-exclamation-triangle ms-2"></i>
                )}
                {isBelowOptimalStock(item.quantity, item.optimalStockLevel) && (
                  <span className="text-warning ms-2">(Below Optimal)</span>
                )}
                {isAboveOptimalStock(item.quantity, item.optimalStockLevel) && (
                  <span className="text-info ms-2">(Above Optimal)</span>
                )}
              </td>
              <td>
                {moment(item.expirationDate).format("DD/MM/YYYY")}
                {isExpired(item.expirationDate) && (
                  <i className="bi bi-exclamation-triangle ms-2 text-danger"></i>
                )}
              </td>
              <td>{item.category}</td>
              <td>
                <Button
                  className="editBtn"
                  variant="primary"
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </Button>
                <Button
                  className="deleteBtn"
                  variant="danger"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {/* Pagination Controls */}
      <div className="d-flex justify-content-end mt-3">
        <Pagination>
          <Pagination.First
            onClick={() => paginate(1)}
            disabled={currentPage === 1}
          />
          <Pagination.Prev
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          />
          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => paginate(index + 1)}
              className="page-item"
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
          <Pagination.Last
            onClick={() => paginate(totalPages)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </div>
    </div>
  );
};

export default Inventory;
