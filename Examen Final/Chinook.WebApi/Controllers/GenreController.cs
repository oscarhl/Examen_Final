using Chinook.UnitOfWork;
using Microsoft.AspNetCore.Mvc;
using Chinook.Models;

namespace Chinook.WebApi.Controllers
{

    [Route("api/Genre")]
    public class GenreController : BaseController
    {
        public GenreController(IUnitOfWork unit) : base(unit)
        {
        }

        [HttpGet]
        [Route("list/{page}/{rows}")]
        public IActionResult GetList(int page, int rows)
        {
            var startRecord = ((page - 1) * rows) + 1;
            var endRecord = page * rows;
            return Ok(_unit.Genres.PagedList(startRecord, endRecord));
        }

        [HttpGet]
        [Route("{id:int}")]
        public IActionResult GetById(int id)
        {
            return Ok(_unit.Genres.GetById(id));
        }

        [HttpPost]
        public IActionResult Post([FromBody] Genre genre)
        {
            if (ModelState.IsValid)
            {
                return Ok(_unit.Genres.Insert(genre));
            }
            return BadRequest(ModelState);

        }

        [HttpPut]
        public IActionResult Put([FromBody] Genre genre)
        {
            if (ModelState.IsValid && _unit.Genres.Update(genre))
            {
                return Ok(new { Message = "The Genre is Updated" });
            }
            return BadRequest(ModelState);

        }

        [HttpDelete]
        [Route("{id}")]
        public IActionResult Delete(int? id)
        {
            if (id.HasValue && id.Value > 0)
            {
                return Ok(_unit.Genres.Delete(new Genre { GenreId = id.Value }));
            }
            return BadRequest(new { Message = "Incorrect data" });

        }

        [HttpGet]
        [Route("count")]
        public IActionResult GetCount()
        {
            return Ok(_unit.Genres.Count());
        }

        [HttpGet]
        public IActionResult GetAllList()
        {
            return Ok(_unit.Genres.GetList());
        }
    }
}