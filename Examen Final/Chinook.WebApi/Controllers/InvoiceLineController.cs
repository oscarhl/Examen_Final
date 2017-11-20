using Chinook.UnitOfWork;
using Microsoft.AspNetCore.Mvc;
using Chinook.Models;

namespace Chinook.WebApi.Controllers
{

    [Route("api/InvoiceLine")]
    public class InvoiceLineController : BaseController
    {
        public InvoiceLineController(IUnitOfWork unit) : base(unit)
        {
        }

        [HttpGet]
        [Route("list/{page}/{rows}")]
        public IActionResult GetList(int page, int rows)
        {
            var startRecord = ((page - 1) * rows) + 1;
            var endRecord = page * rows;
            return Ok(_unit.InvoiceLines.PagedList(startRecord, endRecord));
        }

        [HttpGet]
        [Route("{id:int}")]
        public IActionResult GetById(int id)
        {
            return Ok(_unit.InvoiceLines.GetById(id));
        }

        [HttpPost]
        public IActionResult Post([FromBody] InvoiceLine invoiceLine)
        {
            if (ModelState.IsValid)
            {
                return Ok(_unit.InvoiceLines.Insert(invoiceLine));
            }
            return BadRequest(ModelState);

        }

        [HttpPut]
        public IActionResult Put([FromBody] InvoiceLine invoiceLine)
        {
            if (ModelState.IsValid && _unit.InvoiceLines.Update(invoiceLine))
            {
                return Ok(new { Message = "The InvoiceLine is Updated" });
            }
            return BadRequest(ModelState);

        }

        [HttpDelete]
        [Route("{id}")]
        public IActionResult Delete(int? id)
        {
            if (id.HasValue && id.Value > 0)
            {
                return Ok(_unit.InvoiceLines.Delete(new InvoiceLine { InvoiceLineId = id.Value }));
            }
            return BadRequest(new { Message = "Incorrect data" });

        }

        [HttpGet]
        [Route("count")]
        public IActionResult GetCount()
        {
            return Ok(_unit.InvoiceLines.Count());
        }

        [HttpGet]
        public IActionResult GetAllList()
        {
            return Ok(_unit.InvoiceLines.GetList());
        }
    }
}