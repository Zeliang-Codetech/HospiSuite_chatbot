import axios from "axios";


export const axiosCall = async (options, serviceType) => {
    try {
        const response = await axios.request(options);
        return {
          success: true,
          message: `${serviceType} sent successfully`,
          data: response.data,
        };
      } catch (error) {
        console.error(
          `${serviceType} failed `,
          error.response ? error.response.data : error.message
        );
        return {
          success: false,
          error: `${serviceType} failed`,
          details: error.response ? error.response.data : error.message,
        };
      }
}
