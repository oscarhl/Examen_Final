using Chinook.UnitOfWork;
using Microsoft.AspNetCore.Mvc;
using Chinook.Models;

namespace Chinook.WebApi.Controllers
{

    [Route("api/Employee")]
    public class EmployeeController : BaseController
    {
        public EmployeeController(IUnitOfWork unit) : base(unit)
        {
        }

        [HttpGet]
        [Route("list/{page}/{rows}")]
        public IActionResult GetList(int page, int rows)
        {
            var startRecord = ((page - 1) * rows) + 1;
            var endRecord = page * rows;
            return Ok(_unit.Employees.PagedList(startRecord, endRecord));
        }

        [HttpGet]
        [Route("{id:int}")]
        public IActionResult GetById(int id)
        {
            return Ok(_unit.Employees.GetById(id));
        }

        [HttpPost]
        public IActionResult Post([FromBody] Employee employee)
        {
            if (ModelState.IsValid)
            {
                return Ok(_unit.Employees.Insert(employee));
            }
            return BadRequest(ModelState);

        }

        [HttpPut]
        public IActionResult Put([FromBody] Employee employee)
        {
            if (ModelState.IsValid && _unit.Employees.Update(employee))
            {
                return Ok(new { Message = "The Employee is Updated" });
            }
            return BadRequest(ModelState);

        }

        [HttpDelete]
        [Route("{id}")]
        public IActionResult Delete(int? id)
        {
            if (id.HasValue && id.Value > 0)
            {
                return Ok(_unit.Employees.Delete(new Employee { EmployeeId = id.Value }));
            }
            return BadRequest(new { Message = "Incorrect data" });

        }

        [HttpGet]
        [Route("count")]
        public IActionResult GetCount()
        {
            return Ok(_unit.Employees.Count());
        }

        [HttpGet]
        public IActionResult GetAllList()
        {
            return Ok(_unit.Employees.GetList());
        }
    }
}