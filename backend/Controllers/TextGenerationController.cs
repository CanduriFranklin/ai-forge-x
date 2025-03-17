using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace NewBackend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TextGenerationController : ControllerBase
    {
        [HttpPost("generate-text")]
        public async Task<IActionResult> GenerateText([FromBody] TextGenerationRequest request)
        {
            // Implement the logic to generate text using OpenAI or other services
            // Return the generated text and explanation
            return Ok(new { text = "generated_text", explanation = "Text generated successfully" });
        }
    }

    public class TextGenerationRequest
    {
        public string Prompt { get; set; }
    }
}
