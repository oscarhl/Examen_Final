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
    public class AlbumControllerTest
    {
        private AlbumController _albumController;

        private readonly IUnitOfWork _unitMocked;

        public AlbumControllerTest()
        {
            var unitMocked = new UnitOfWorkMoqData();
            _unitMocked = unitMocked.GetInstante();
            _albumController = new AlbumController(_unitMocked);
        }

        [Fact(DisplayName = "[AlbumController] Get List")]
        public void Get_All_Test()
        {
            var result = _albumController.GetAllList() as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = result.Value as List<Album>;
            model.Count.Should().BeGreaterThan(0);
        }

        [Fact(DisplayName = "[AlbumController] Insert")]
        public void Insert_Album_Test()
        {
            var album = new Album
            {
                AlbumId = 400,
                Title = "Corazon Cerrano",
                ArtistId=50
            };

            var result = _albumController.Post(album) as ObjectResult;
            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = Convert.ToInt32(result.Value);
            model.Should().Be(400);

        }

        [Fact(DisplayName = "[AlbumController] Update")]
        public void Update_Customer_Test()
        {
            var currentAlbumprueba = _unitMocked.Albums.GetById(400);

            var Album = new Album
            {
                AlbumId = 1,
                Title = "La unica Tropical",
                ArtistId = 8
            };

            var result = _albumController.Put(Album) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();
            
            var model = result.Value?.GetType().GetProperty("Message").GetValue(result.Value);
            model.Should().Be("The Album is Updated");


            var currentAlbum = _unitMocked.Albums.GetById(1);
            currentAlbum.Should().NotBeNull();
            currentAlbum.AlbumId.Should().Be(Album.AlbumId);
            currentAlbum.Title.Should().Be(Album.Title);
            currentAlbum.ArtistId.Should().Be(Album.ArtistId);          


        }


        [Fact(DisplayName = "[AlbumController] Delete")]
        public void Delete_Album_Test()
        {
            var album = 1;

            var result = _albumController.Delete(album) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = Convert.ToBoolean(result.Value);
            model.Should().BeTrue();

            var currentAlbum = _unitMocked.Albums.GetById(1);
            currentAlbum.Should().BeNull();
        }

        [Fact(DisplayName = "[AlbumController] Get By Id")]
        public void GetById_Album_Test()
        {
            var result = _albumController.GetById(1) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = result.Value as Album;
            model.Should().NotBeNull();
            model.AlbumId.Should().BeGreaterThan(0);
        }


       
    }
}
