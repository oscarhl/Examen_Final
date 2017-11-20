using Microsoft.AspNetCore.Mvc;
using Chinook.Models;
using Chinook.UnitOfWork;

namespace Chinook.WebApi.Controllers
{

    [Route("api/MediaType")]
    public class MediaTypeController : BaseController
    {
        public MediaTypeController(IUnitOfWork unit) : base(unit)
        {
        }

        [HttpGet]
        [Route("list/{page}/{rows}")]
        public IActionResult GetList(int page, int rows)
        {
            var startRecord = ((page - 1) * rows) + 1;
            var endRecord = page * rows;
            return Ok(_unit.MediaTypes.PagedList(startRecord, endRecord));
        }

        [HttpGet]
        [Route("{id:int}")]
        public IActionResult GetById(int id)
        {
            return Ok(_unit.MediaTypes.GetById(id));
        }

        [HttpPost]
        public IActionResult Post([FromBody] MediaType mediaType)
        {
            if (ModelState.IsValid)
            {
                return Ok(_unit.MediaTypes.Insert(mediaType));
            }
            return BadRequest(ModelState);

        }

        [HttpPut]
        public IActionResult Put([FromBody] MediaType mediaType)
        {
            if (ModelState.IsValid && _unit.MediaTypes.Update(mediaType))
            {
                return Ok(new { Message = "The MediaType is Updated" });
            }
            return BadRequest(ModelState);

        }

        [HttpDelete]
        [Route("{id}")]
        public IActionResult Delete(int? id)
        {
            if (id.HasValue && id.Value > 0)
            {
                return Ok(_unit.MediaTypes.Delete(new MediaType { MediaTypeId = id.Value }));
            }
            return BadRequest(new { Message = "Incorrect data" });

        }

        [HttpGet]
        [Route("count")]
        public IActionResult GetCount()
        {
            return Ok(_unit.MediaTypes.Count());
        }

        [HttpGet]
        public IActionResult GetAllList()
        {
            return Ok(_unit.MediaTypes.GetList());
        }
    }
}