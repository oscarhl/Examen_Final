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
    public class GenreControllerTest
    {
        private GenreController _GenreController;

        private readonly IUnitOfWork _unitMocked;

        public GenreControllerTest()
        {
            var unitMocked = new UnitOfWorkMoqData();
            _unitMocked = unitMocked.GetInstante();
            _GenreController = new GenreController(_unitMocked);
        }

        [Fact(DisplayName = "[GenreController] Get List")]
        public void Get_All_Test()
        {
            var result = _GenreController.GetAllList() as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = result.Value as List<Genre>;
            model.Count.Should().BeGreaterThan(0);
        }

        [Fact(DisplayName = "[GenreController] Insert")]
        public void Insert_Genre_Test()
        {
            var genre = new Genre
            {
                GenreId = 101,
                Name="Baladas"

            };

            var result = _GenreController.Post(genre) as ObjectResult;
            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = Convert.ToInt32(result.Value);
            model.Should().Be(101);

        }

        [Fact(DisplayName = "[GenreController] Update")]
        public void Update_Genre_Test()
        {
            var currentGenreprueba = _unitMocked.Genres.GetById(1);

            var genre = new Genre
            {
                GenreId = 1,
                Name="Cumbia"
            };

            var result = _GenreController.Put(genre) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = result.Value?.GetType().GetProperty("Message").GetValue(result.Value);
            model.Should().Be("The Genre is Updated");

            var currentGenre = _unitMocked.Genres.GetById(1);
            currentGenre.Should().NotBeNull();
            currentGenre.GenreId.Should().Be(genre.GenreId);

        }

        [Fact(DisplayName = "[GenreController] Delete")]
        public void Delete_Genre_Test()
        {
            var Genre = 1;

            var result = _GenreController.Delete(Genre) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = Convert.ToBoolean(result.Value);
            model.Should().BeTrue();

            var currentGenre = _unitMocked.Genres.GetById(1);
            currentGenre.Should().BeNull();
        }

        [Fact(DisplayName = "[GenreController] Get By Id")]
        public void GetById_Genre_Test()
        {
            var result = _GenreController.GetById(1) as OkObjectResult;

            result.Should().NotBeNull();
            result.Value.Should().NotBeNull();

            var model = result.Value as Genre;
            model.Should().NotBeNull();
            model.GenreId.Should().BeGreaterThan(0);
        }
    }
}
