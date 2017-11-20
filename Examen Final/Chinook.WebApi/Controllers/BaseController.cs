using Microsoft.AspNetCore.Mvc;
using Chinook.UnitOfWork;
using Microsoft.AspNetCore.Authorization;

namespace Chinook.WebApi.Controllers
{
    [Produces("application/json")]
    [Authorize]
    public class BaseController : Controller
    {
        protected IUnitOfWork _unit;

        public BaseController(IUnitOfWork unit)
        {
            _unit = unit;
        }
    }
}