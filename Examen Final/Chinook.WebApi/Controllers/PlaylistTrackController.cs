using Chinook.UnitOfWork;
using Microsoft.AspNetCore.Mvc;
using Chinook.Models;

namespace Chinook.WebApi.Controllers
{

    [Route("api/PlaylistTrack")]
    public class PlaylistTrackController : BaseController
    {
        public PlaylistTrackController(IUnitOfWork unit) : base(unit)
        {
        }

        [HttpGet]
        [Route("list/{page}/{rows}")]
        public IActionResult GetList(int page, int rows)
        {
            var startRecord = ((page - 1) * rows) + 1;
            var endRecord = page * rows;
            return Ok(_unit.PlaylistTracks.PagedList(startRecord, endRecord));
        }

        [HttpGet]
        [Route("{id:int}")]
        public IActionResult GetById(int id)
        {
            return Ok(_unit.PlaylistTracks.GetById(id));
        }

        [HttpPost]
        public IActionResult Post([FromBody] PlaylistTrack playlistTrack)
        {
            if (ModelState.IsValid)
            {
                return Ok(_unit.PlaylistTracks.Insert(playlistTrack));
            }
            return BadRequest(ModelState);

        }

        [HttpPut]
        public IActionResult Put([FromBody] PlaylistTrack playlistTrack)
        {
            if (ModelState.IsValid && _unit.PlaylistTracks.Update(playlistTrack))
            {
                return Ok(new { Message = "The playlistTrack is Updated" });
            }
            return BadRequest(ModelState);

        }

        [HttpDelete]
        [Route("{id}")]
        public IActionResult Delete(int? id)
        {
            if (id.HasValue && id.Value > 0)
            {
                return Ok(_unit.PlaylistTracks.Delete(new PlaylistTrack { PlaylistId = id.Value }));
            }
            return BadRequest(new { Message = "Incorrect data" });

        }

        [HttpGet]
        [Route("count")]
        public IActionResult GetCount()
        {
            return Ok(_unit.PlaylistTracks.Count());
        }

        [HttpGet]
        public IActionResult GetAllList()
        {
            return Ok(_unit.PlaylistTracks.GetList());
        }
    }
}