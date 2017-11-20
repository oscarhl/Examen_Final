using Cibertec.Angular.Code;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Cibertec.Angular.Controllers
{
    public class HomeController : Controller
    {
        private readonly ConfigurationFile _config;

        public HomeController(IOptions<ConfigurationFile> config)
        {
            _config = config.Value;
        }
        public IActionResult Index()
        {
            ViewBag.WebApiUrl = _config.WebApiUrl;
            return View();
        }

        public IActionResult Error()
        {
            return View();
        }
    }
}
