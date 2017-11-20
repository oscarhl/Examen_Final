using Chinook.UnitOfWork;
using Microsoft.AspNetCore.Mvc;
using Chinook.Models;

namespace Chinook.WebApi.Controllers
{

    [Route("api/Invoice")]
    public class InvoiceController : BaseController
    {
        public InvoiceController(IUnitOfWork unit) : base(unit)
        {
        }

        [HttpGet]
        [Route("list/{page}/{rows}")]
        public IActionResult GetList(int page, int rows)
        {
            var startRecord = ((page - 1) * rows) + 1;
            var endRecord = page * rows;
            return Ok(_unit.Invoices.PagedList(startRecord, endRecord));
        }

        [HttpGet]
        [Route("{id:int}")]
        public IActionResult GetById(int id)
        {
            return Ok(_unit.Invoices.GetById(id));
        }

        [HttpPost]
        public IActionResult Post([FromBody] Invoice invoice)
        {
            if (ModelState.IsValid)
            {
                return Ok(_unit.Invoices.Insert(invoice));
            }
            return BadRequest(ModelState);

        }

        [HttpPut]
        public IActionResult Put([FromBody] Invoice invoice)
        {
            if (ModelState.IsValid && _unit.Invoices.Update(invoice))
            {
                return Ok(new { Message = "The Invoice is Updated" });
            }
            return BadRequest(ModelState);

        }

        [HttpDelete]
        [Route("{id}")]
        public IActionResult Delete(int? id)
        {
            if (id.HasValue && id.Value > 0)
            {
                return Ok(_unit.Invoices.Delete(new Invoice { InvoiceId = id.Value }));
            }
            return BadRequest(new { Message = "Incorrect data" });

        }

        [HttpGet]
        [Route("count")]
        public IActionResult GetCount()
        {
            return Ok(_unit.Invoices.Count());
        }

        [HttpGet]
        public IActionResult GetAllList()
        {
            return Ok(_unit.Invoices.GetList());
        }
    }
}