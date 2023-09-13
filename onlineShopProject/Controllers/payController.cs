using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using onlineShopProject.Models;
using System.Web.Mvc;
using System.Text;
using System.Web.Security;
using Newtonsoft.Json;
using System.Net.Http;
using System.Globalization;
using System.IO;
using System.Text.RegularExpressions;
using System.Web.Helpers;
using System.Web.Hosting;
namespace hardworker.Controllers
{
    public class PayController : Controller
    {

        onlineShop context = new onlineShop();
        private string GatewaySend = "https://panel.aqayepardakht.ir/api/v2/create";
        private string GatewayResult = "https://panel.aqayepardakht.ir/api/v2/verify";

        private string pin = "aqayepardakht";


        private new string Redirect = "https://localhost:44392/pay/CallBack";



        [HttpPost]
        [ActionName("submit")]
        [ValidateAntiForgeryToken]
        public async System.Threading.Tasks.Task<ActionResult> SubmitAsync(string fn, string price)
        {
            try
            {

                using (var client = new HttpClient())
                {
                    var values = new Dictionary<string, string>
                    {
                        { "pin", pin },
                        { "amount", price },
                        { "callback", Redirect },
                        { "invoice_id", fn }


                    };

                    var content = new FormUrlEncodedContent(values);

                    var response = await client.PostAsync(GatewaySend, content);
                    string responseString = await response.Content.ReadAsStringAsync();
                    dynamic jsonObject = JsonConvert.DeserializeObject(responseString);
                    string transid = jsonObject.transid;

                    int intfn = int.Parse(fn);
                    var items = context.invoiceTbls.Where(x => x.factorNumber == intfn).ToList();
                    
                    foreach(var item in items)
                    {
                        item.transID = transid;
                    }
                    context.SaveChanges();

                    if (responseString.Length > 3)
                    {
                        return Json(new { message = "https://panel.aqayepardakht.ir/startpay/" + transid, success = true, JsonRequestBehavior.AllowGet });

                    }
                    else
                    {
                        //return View();
                        int error = int.Parse(responseString);
                        return Json(new { error = error, success = false, JsonRequestBehavior.AllowGet });
                    }
                }

            }
            catch (Exception ex)
            {
                return Json(new { message = ex.Message, success = true, JsonRequestBehavior.AllowGet });
            }
        }



        [AllowAnonymous]
        [ActionName("CallBack")]
        public async System.Threading.Tasks.Task<ActionResult> CallBackAsync()
        {
            ViewBag.sc = 1;
            ViewBag.msg = 125;
            if (!string.IsNullOrEmpty(Request.Form["transId"]))
            {
                string transID = Request.Form["transid"].ToString();
                var items = context.invoiceViews.Where(x => x.transID == transID).ToList();
                int intamount = items.Sum(x => x.price);
                string amount = intamount.ToString();

                    using (var client = new HttpClient())
                    {
                        var values = new Dictionary<string, string>
                        {
                            { "pin", pin },
                            { "amount", amount },

                            { "transid", Request.Form["transid"].ToString() },
                        };


                        var content = new FormUrlEncodedContent(values);
                        var response = await client.PostAsync(GatewayResult, content);
                        var responseString = await response.Content.ReadAsStringAsync();
                        string trackinNumber = Request.Form["tracking_number"].ToString();
                        string cardnumber = Request.Form["cardnumber"].ToString();
                        dynamic jsonObject = JsonConvert.DeserializeObject(responseString);
                        var status = jsonObject.status;

                        if (status == "success")
                        {
                          
                                var products = context.invoiceTbls.Where(x => x.transID == transID).ToList();
                                foreach (var item in products)
                                {
                                    item.status = true;
                                    item.trackingID = trackinNumber;
                                    item.cardNumber = cardnumber;
                                }
                                context.SaveChanges();
                                ViewBag.sc = 1;
                                ViewBag.msg = trackinNumber;
                            
                        }
                        else
                        {
                            ViewBag.sc = 0;
                            //ViewBag.message = ViewBag.message = ret.errorCode + " " + ret.errorMessage;

                        }
                    }
            }
            else
            {
                ViewBag.sc = "0";
            }
            //ViewBag.success = 1;
            //var a = 125;
            //ViewBag.message = "fd123" + a;
            return View();
        }


        public ActionResult Invoice(string invoiceCode)
        {
            if (string.IsNullOrEmpty(invoiceCode))
                ViewBag.ShowImage = "0";
            else
            {
                ViewBag.ShowImage = "1";
                ViewBag.InvoiceCode = invoiceCode.Trim();
            }
            return View();
        }
        [HttpPost]
        public ActionResult SearchFile(string invoiceCode)
        {
            if (!Request.IsAjaxRequest())
                return Json(false);
            var relativePath = "~/UploadedImages/" + invoiceCode + ".jpg";
            var absolutePath = HttpContext.Server.MapPath(relativePath);
            return Json(System.IO.File.Exists(absolutePath));
        }
    }
}

