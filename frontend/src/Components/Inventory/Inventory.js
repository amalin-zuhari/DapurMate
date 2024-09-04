import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { Modal, Button, Form, Table, Alert, Pagination } from "react-bootstrap";
import "../../Styles/Inventory.css";
import moment from "moment";

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [show, setShow] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "expirationDate",
    direction: "ascending",
  });
  const [formData, setFormData] = useState({
    itemName: "",
    quantity: "",
    unitOfMeasurement: "", // Ensure consistent naming
    optimalStockLevel: "",
    expirationDate: "",
    category: "Vegetables",
  });
  const [notification, setNotification] = useState({
    type: "",
    message: "",
    show: false,
  });
  const [formValid, setFormValid] = useState(true);
  const [filterType, setFilterType] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of items per page

  const units = [
    "kilogram",
    "Gram",
    "Liter",
    "Milliliter",
    "Box(es)",
    "Piece",
    "Bottle",
    "Pack",
    "Carton",
  ];

  const categories = ["Vegetables", "Dairy", "Fruits", "Beverages", "Snacks"];
  const expirationThreshold = 7;

  const [editId, setEditId] = useState(null);

  const isLowStock = (quantity, optimalStockLevel) => {
    return quantity < optimalStockLevel;
  };

  const isBelowOptimalStock = (quantity, optimalStockLevel) =>
    quantity < optimalStockLevel;

  const isAboveOptimalStock = (quantity, optimalStockLevel) =>
    quantity > optimalStockLevel * 1.2; // 20% above optimal

  const isExpired = (expirationDate) => {
    const expiration = moment(expirationDate, "YYYY-MM-DD").toDate();
    const now = new Date();
    return expiration < now;
  };

  const isApproachingExpiration = (expirationDate) => {
    const expiration = moment(expirationDate, "YYYY-MM-DD").toDate();
    const now = new Date();
    const diffTime = expiration - now;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays <= expirationThreshold && diffDays > 0;
  };

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

  const handleShow = () => setShow(true);

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

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const showNotification = (type, message) => {
    setNotification({ type, message, show: true });
    setTimeout(() => {
      setNotification({ type: "", message: "", show: false });
    }, 3000);
  };

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

  const handleStatBoxClick = (type) => {
    setFilterType(type);
  };

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

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);

  const handleSubmit = async () => {
    if (
      !formData.itemName ||
      !formData.quantity ||
      !formData.unitOfMeasurement || // Check if unitOfMeasurement is provided
      !formData.optimalStockLevel || // Check if optimalStockLevel is provided
      !formData.expirationDate ||
      !formData.category
    ) {
      setFormValid(false);
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

      setEditId(null);
      handleClose();
      fetchItems();
    } catch (err) {
      console.error("Error saving item:", err.message); // Log error
      showNotification("error", "Failed to save item.");
    }
  };

  const handleDateChange = (e) => {
    setFormData({ ...formData, expirationDate: e.target.value });
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setFormData({
      itemName: item.itemName,
      quantity: item.quantity,
      expirationDate: moment(item.expirationDate).format("YYYY-MM-DD"),
      category: item.category,
      optimalStockLevel: item.optimalStockLevel, // Set optimalStockLevel
      unitOfMeasurement: item.unitOfMeasurement, // Set unitOfMeasurement
    });
    handleShow();
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/inventory/${id}`);
      showNotification("success", "Item deleted successfully.");
      fetchItems();
    } catch (err) {
      console.error("Error deleting item:", err);
      showNotification("error", "Failed to delete item.");
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="inventory-container">
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

      <Modal show={show} onHide={handleClose}>
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
