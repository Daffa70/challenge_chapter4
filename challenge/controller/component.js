const {
  Supplier,
  Component,
  ComponentSupplier,
  Product,
} = require("../models");

module.exports = {
  index: async (req, res, next) => {
    try {
      const components = await Component.findAll({
        include: [
          {
            model: Supplier,
            attributes: ["id", "name", "address"],
          },
          {
            model: Product,
            attributes: ["id", "name", "quantity"],
          },
        ],
        order: [["id", "ASC"]],
      });

      return res.status(200).json({
        status: true,
        message: "success",
        data: components,
      });
    } catch (error) {
      next(error);
    }
  },

  show: async (req, res, next) => {
    try {
      const { component_id } = req.params;

      const component = await Component.findOne({
        where: {
          id: component_id,
        },
        include: [
          {
            model: Supplier,
            attributes: ["id", "name", "address"],
          },
          {
            model: Product,
            attributes: ["id", "name", "quantity"],
          },
        ],
      });

      if (!component) {
        return res.status(404).json({
          status: false,
          message: `can't find component with id ${component_id}`,
          data: null,
        });
      }

      return res.status(200).json({
        status: true,
        message: "success",
        data: component,
      });
    } catch (error) {
      next(error);
    }
  },

  store: async (req, res, next) => {
    try {
      let message = "";
      const { name, description, supplier_id } = req.body;

      const component = await Component.create({
        name: name,
        description: description,
      });

      if (req.body.hasOwnProperty("supplier_id")) {
        supplier_id.forEach(async (supplierId) => {
          const check_supplier = await Supplier.findOne({
            where: {
              id: supplierId,
            },
          });

          if (!check_supplier) {
            console.log(`can't find supplier with id ${supplierId}`);
          } else {
            const component_supplier = await ComponentSupplier.create({
              supplier_id: supplierId,
              component_id: component.id,
            });
          }
        });
      }

      return res.status(201).json({
        status: true,
        message: "success" + message,
        data: component,
      });
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const { component_id } = req.params;

      const updated = await Component.update(req.body, {
        where: { id: component_id },
      });

      if (updated[0] == 0) {
        return res.status(404).json({
          status: false,
          message: `can't find component with id ${component_id}`,
          data: null,
        });
      } else {
        if (req.body.hasOwnProperty("supplier_id")) {
          const deleted = await ComponentSupplier.destroy({
            where: { component_id: component_id },
          });

          req.body.supplier_id.forEach(async (supplierId) => {
            const check_supplier = await Supplier.findOne({
              where: {
                id: supplierId,
              },
            });

            if (!check_supplier) {
              console.log(`can't find supplier with id ${supplierId}`);
            } else {
              const component_supplier = await ComponentSupplier.create({
                supplier_id: supplierId,
                component_id: component_id,
              });
            }
          });
        }
      }

      return res.status(201).json({
        status: true,
        message: "success",
        data: updated[0],
      });
    } catch (error) {
      next(error);
    }
  },

  destroy: async (req, res, next) => {
    try {
      const { component_id } = req.params;

      const deleted = await Component.destroy({
        where: { id: component_id },
      });

      if (!deleted) {
        return res.status(404).json({
          status: false,
          message: `can't find component with id ${component_id}`,
          data: null,
        });
      }

      return res.status(201).json({
        status: true,
        message: "success",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  },

  storeSupplierComponent: async (req, res, next) => {
    try {
      const { supplier_id, component_id } = req.body;

      if (!supplier_id || !req.body.hasOwnProperty("supplier_id")) {
        return res.status(404).json({
          status: false,
          message: `supplier_id cannot be null`,
          data: null,
        });
      }

      if (!component_id || !req.body.hasOwnProperty("component_id")) {
        return res.status(404).json({
          status: false,
          message: `component_id cannot be null`,
          data: null,
        });
      }

      const check_supplierid = await Supplier.findOne({
        where: {
          id: supplier_id,
        },
      });

      const check_componentid = await Component.findOne({
        where: {
          id: component_id,
        },
      });

      if (!check_supplierid) {
        return res.status(404).json({
          status: false,
          message: `can't find supplier with id ${supplier_id}`,
          data: null,
        });
      }

      if (!check_componentid) {
        return res.status(404).json({
          status: false,
          message: `can't find component with id ${component_id}`,
          data: null,
        });
      }

      const checkDataExist = await ComponentSupplier.findOne({
        where: {
          supplier_id: supplier_id,
          component_id: component_id,
        },
      });

      if (checkDataExist) {
        return res.status(401).json({
          status: false,
          message: `data already exist`,
          data: null,
        });
      }

      const add = await ComponentSupplier.create({
        supplier_id,
        component_id,
      });

      return res.status(201).json({
        status: true,
        message: "success",
        data: add,
      });
    } catch (error) {
      next(error);
    }
  },

  deleteProductComponent: async (req, res, next) => {
    try {
      const { supplier_id, component_id } = req.body;

      if (!supplier_id || !req.body.hasOwnProperty("supplier_id")) {
        return res.status(404).json({
          status: false,
          message: `supplier_id cannot be null`,
          data: null,
        });
      }

      if (!component_id || !req.body.hasOwnProperty("component_id")) {
        return res.status(404).json({
          status: false,
          message: `component_id cannot be null`,
          data: null,
        });
      }

      const check_supplierid = await Supplier.findOne({
        where: {
          id: supplier_id,
        },
      });

      const check_componentid = await Component.findOne({
        where: {
          id: component_id,
        },
      });

      if (!check_supplierid) {
        return res.status(404).json({
          status: false,
          message: `can't find supplier with id ${supplier_id}`,
          data: null,
        });
      }

      if (!check_componentid) {
        return res.status(404).json({
          status: false,
          message: `can't find component with id ${component_id}`,
          data: null,
        });
      }

      const checkDataExist = await ComponentSupplier.findOne({
        where: {
          supplier_id: supplier_id,
          component_id: component_id,
        },
      });

      if (!checkDataExist) {
        return res.status(401).json({
          status: false,
          message: `data not exist`,
          data: null,
        });
      }

      const deleted = await ComponentSupplier.destroy({
        where: { supplier_id: supplier_id, component_id: component_id },
      });

      return res.status(201).json({
        status: true,
        message: "success",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  },
};
