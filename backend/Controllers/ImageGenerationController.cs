using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace NewBackend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ImageGenerationController : ControllerBase
    {
        [HttpPost("generate-image")]
        public async Task<IActionResult> GenerateImage([FromBody] ImageGenerationRequest request)
        {
            // Implement the logic to generate image using OpenAI or other services
            // Return the generated image URL and explanation
            return Ok(new { image = "image_url", explanation = "Image generated successfully" });
        }
    }

    public class ImageGenerationRequest
    {
        public string Prompt { get; set; }
        public int Width { get; set; } = 512;
        public int Height { get; set; } = 512;
        public int Steps { get; set; } = 30;
        public string NegativePrompt { get; set; } = "";
        public int Seed { get; set; } = -1;
    }
}
