using Chinook.UnitOfWork;
using Microsoft.AspNetCore.Mvc;
using Chinook.Models;

namespace Chinook.WebApi.Controllers
{

    [Route("api/Track")]
    public class TrackController : BaseController
    {
        public TrackController(IUnitOfWork unit) : base(unit)
        {
        }

        [HttpGet]
        [Route("list/{page}/{rows}")]
        public IActionResult GetList(int page, int rows)
        {
            var startRecord = ((page - 1) * rows) + 1;
            var endRecord = page * rows;
            return Ok(_unit.Tracks.PagedList(startRecord, endRecord));
        }

        [HttpGet]
        [Route("{id:int}")]
        public IActionResult GetById(int id)
        {
            return Ok(_unit.Tracks.GetById(id));
        }

        [HttpPost]
        public IActionResult Post([FromBody] Track track)
        {
            if (ModelState.IsValid)
            {
                return Ok(_unit.Tracks.Insert(track));
            }
            return BadRequest(ModelState);

        }

        [HttpPut]
        public IActionResult Put([FromBody] Track track)
        {
            if (ModelState.IsValid && _unit.Tracks.Update(track))
            {
                return Ok(new { Message = "The Track is Updated" });
            }
            return BadRequest(ModelState);

        }

        [HttpDelete]
        [Route("{id}")]
        public IActionResult Delete(int? id)
        {
            if (id.HasValue && id.Value > 0)
            {
                return Ok(_unit.Tracks.Delete(new Track { TrackId = id.Value }));
            }
            return BadRequest(new { Message = "Incorrect data" });

        }

        [HttpGet]
        [Route("count")]
        public IActionResult GetCount()
        {
            return Ok(_unit.Tracks.Count());
        }

        [HttpGet]
        public IActionResult GetAllList()
        {
            return Ok(_unit.Tracks.GetList());
        }
    }
}