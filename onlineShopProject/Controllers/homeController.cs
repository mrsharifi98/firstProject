using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using onlineShopProject.Models;
using System.Web.Mvc;
using System.Text;
using System.Web.Security;

namespace onlineShopProject.Controllers
{
    public class homeController : Controller
    {

        onlineShop context = new onlineShop();

        public ActionResult Index()
        {
            return View();
        }


        public ActionResult getProducts()
        {
            var products = context.ProductsTbls.Select(item => new { item.name, item.img, item.price, item.pkID }).ToList();
            return Json(products, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetSelectedProducts(int[] cartItems)
        {
            var productDetails = context.ProductsTbls.ToList(); // Fetch all product details
            var res = new List<object>(); // Initialize the result list
            var j = 0;

            if (cartItems != null)
            {
                foreach (var product in productDetails)
                {
                    var counter = cartItems.Count(cartItem => cartItem == product.pkID);

                    if (counter > 0)
                    {
                        var currentRes = new
                        {
                            Counter = counter,
                            ProductDetail = new
                            {
                                product.price,
                                product.name,
                                product.pkID,
                                product.img
                            }
                        };

                        res.Add(currentRes); // Add results to the list
                        j++;
                    }
                }
            }
            

            return Json(res, JsonRequestBehavior.AllowGet);
        }



        public ActionResult login()
        {
            return View();
        }

        public ActionResult checkOut()
        {
            return View();
        }

        public ActionResult cart()
        {
            return View();
        }

        public ActionResult succesfulShoping()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult signIn(string user, string pass)
        {

            var usernmaeCheck = context.CostumersTbls.Where(x => x.Phone == user).SingleOrDefault();
            int ress = 0;

            if (usernmaeCheck == null)
            {
                ress = 0;
            }

            else if (usernmaeCheck.Password.TrimEnd() == pass && usernmaeCheck.fkStatus == 2)
            {

                var cookieText = Encoding.UTF8.GetBytes(user);
                var encryptedValue = Convert.ToBase64String(MachineKey.Protect(cookieText, "ProtectCookie"));
                Response.Cookies["userID"].Value = encryptedValue;
                Response.Cookies["userID"].Expires = DateTime.Now.AddDays(40);

                ress = 1;
            }

            else if(usernmaeCheck.Password.TrimEnd() == pass && usernmaeCheck.fkStatus == 1)
            {
                ress = 2;
            }

            else{
                ress = 3;
            }

            return Json(ress, JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult signUp(string name, string family, string username, string password)
        {

            var usernmaeCheck = context.CostumersTbls.Where(x => x.Phone == username).SingleOrDefault();
            int ress = 0;

            if (usernmaeCheck != null)
            {
                ress = 2;
            }

            else
            {
                CostumersTbl newCostumer = new CostumersTbl();
                newCostumer.Name = name;
                newCostumer.Family = family;
                newCostumer.Phone = username;
                newCostumer.Password = password;
                newCostumer.fkStatus = 1;

                context.CostumersTbls.Add(newCostumer);
                context.SaveChanges();

                ress = 1;
            }

            return Json(ress, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult verification(string username, int code)
        {

            var result = 0;
            var costumerID = context.CostumersTbls.Where(x => x.Phone == username).SingleOrDefault();
            var SMSCode = 5485;

            if(code == SMSCode)
            {
                costumerID.fkStatus = 2;
                context.SaveChanges();
                result = 1;
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }


        public ActionResult createInvoice(int[] basketItems)
        {

            var costumerID = 0;
            var factorNumber = context.invoiceTbls.Max(x => x.factorNumber) + 1;
            var state = 0;
            var totalPrice = 0;
            if (Request.Cookies["userID"] != null)
            {
                string encryptedValue = Request.Cookies["userID"].Value;

                try
                {
                    byte[] encryptedBytes = Convert.FromBase64String(encryptedValue);
                    byte[] decryptedBytes = MachineKey.Unprotect(encryptedBytes, "ProtectCookie");
                    string user = Encoding.UTF8.GetString(decryptedBytes);
                    var costumer = context.CostumersTbls.Where(x => x.Phone == user).SingleOrDefault();
                    costumerID = costumer.pkID;
                    state = 1;

                    // Now 'user' contains the original username
                    // You can use it as needed
                }
                catch (Exception ex)
                {
                    // Handle decryption errors or invalid cookies here
                    // It's important to handle exceptions to ensure your application's robustness
                }
            }
            else
            {
                // The cookie doesn't exist or has expired
                // Handle this case as needed
            }

            var recordsToRemove = context.invoiceTbls
            .Where(x => x.fkCostumer == costumerID && x.status == false)
            .ToList(); // Execute the query and get the records to remove as a list

            foreach (var record in recordsToRemove)
            {
                context.invoiceTbls.Remove(record); // Remove each record
            }

            List<invoiceTbl> newFactorList = new List<invoiceTbl>();
                foreach(var item in basketItems)
            {
                invoiceTbl additem = new invoiceTbl();
                additem.factorNumber = factorNumber;
                additem.fkCostumer = costumerID;
                additem.fkProduct = item;
                additem.status = false;
                additem.transID = "0";
                additem.trackingID = "0";
                newFactorList.Add(additem);
            }

            context.invoiceTbls.AddRange(newFactorList);
            context.SaveChanges();

            totalPrice = context.invoiceViews.Where(x => x.factorNumber == factorNumber).Sum(x => x.price);


            return Json(new { state = state, fn = factorNumber, price = totalPrice }, JsonRequestBehavior.AllowGet);
        }

    }
}

