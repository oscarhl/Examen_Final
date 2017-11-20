using Chinook.UnitOfWork;
using Microsoft.AspNetCore.Mvc;
using Chinook.Models;

namespace Chinook.WebApi.Controllers
{

    [Route("api/Artist")]
    public class ArtistController : BaseController
    {
        public ArtistController(IUnitOfWork unit) : base(unit)
        {
        }

        [HttpGet]
        [Route("list/{page}/{rows}")]
        public IActionResult GetList(int page, int rows)
        {
            var startRecord = ((page - 1) * rows) + 1;
            var endRecord = page * rows;
            return Ok(_unit.Artists.PagedList(startRecord, endRecord));
        }

        [HttpGet]
        [Route("{id:int}")]
        public IActionResult GetById(int id)
        {
            return Ok(_unit.Artists.GetById(id));
        }

        [HttpPost]
        public IActionResult Post([FromBody] Artist artist)
        {
            if (ModelState.IsValid)
            {
                return Ok(_unit.Artists.Insert(artist));
            }
            return BadRequest(ModelState);

        }

        [HttpPut]
        public IActionResult Put([FromBody] Artist artist)
        {
            if (ModelState.IsValid && _unit.Artists.Update(artist))
            {
                return Ok(new { Message = "The Artist is Updated" });
            }
            return BadRequest(ModelState);

        }

        [HttpDelete]
        [Route("{id}")]
        public IActionResult Delete(int? id)
        {
            if (id.HasValue && id.Value > 0)
            {
                return Ok(_unit.Artists.Delete(new Artist { ArtistId = id.Value }));
            }
            return BadRequest(new { Message = "Incorrect data" });

        }

        [HttpGet]
        [Route("count")]
        public IActionResult GetCount()
        {
            return Ok(_unit.Artists.Count());
        }

        [HttpGet]
        public IActionResult GetAllList()
        {
            return Ok(_unit.Artists.GetList());
        }
    }
}