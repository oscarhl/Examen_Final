using Chinook.ModData;
using Chinook.Models;
using Chinook.UnitOfWork;
using Chinook.WebApi.Controllers;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using Xunit;

namespace Chinook.WebApi.Test
{
    public class ArtistControllerTest
    {
        private ArtistController _ArtistController;

        private readonly IUnitOfWork _unitMocked;

        public ArtistControllerTest()
        {
            var unitMocked = new UnitOfWorkMoqData();
            _unitMocked = unitMocked.GetInstante();
            _ArtistController = new ArtistController(_unitMocked);
        }

        [Fact(DisplayName = "[ArtistController] Get List")]
        public void Get_All_Test()
        {
            var result = _ArtistController.GetAllList() as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = result.Value as List<Artist>;
            model.Count.Should().BeGreaterThan(0);
        }

        [Fact(DisplayName = "[ArtistController] Insert")]
        public void Insert_Artist_Test()
        {
            var artist = new Artist
            {
                ArtistId = 101,
                Name = "Oscar Hernandez"
               
            };

            var result = _ArtistController.Post(artist) as ObjectResult;
            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = Convert.ToInt32(result.Value);
            model.Should().Be(101);

        }

        [Fact(DisplayName = "[ArtistController] Update")]
        public void Update_Customer_Test()
        {
            var currentArtistprueba = _unitMocked.Artists.GetById(1);

            var artist = new Artist
            {
                ArtistId = 1,
                Name = "Yuliana Hernandez"
            };

            var result = _ArtistController.Put(artist) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = result.Value?.GetType().GetProperty("Message").GetValue(result.Value);
            model.Should().Be("The Artist is Updated");

            var currentArtist = _unitMocked.Artists.GetById(1);
            currentArtist.Should().NotBeNull();
            currentArtist.ArtistId.Should().Be(artist.ArtistId);
            currentArtist.Name.Should().Be(artist.Name);
        }

        [Fact(DisplayName = "[ArtistController] Delete")]
        public void Delete_Artist_Test()
        {
            var artist = 1;

            var result = _ArtistController.Delete(artist) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = Convert.ToBoolean(result.Value);
            model.Should().BeTrue();

            var currentArtist = _unitMocked.Artists.GetById(1);
            currentArtist.Should().BeNull();
        }

        [Fact(DisplayName = "[ArtistController] Get By Id")]
        public void GetById_Artist_Test()
        {
            var result = _ArtistController.GetById(1) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = result.Value as Artist;
            model.Should().NotBeNull();
            model.ArtistId.Should().BeGreaterThan(0);
        }
    }
}
